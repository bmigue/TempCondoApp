package com.cenfotec.web.rest;

import static com.cenfotec.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.IntegrationTest;
import com.cenfotec.domain.CheckLog;
import com.cenfotec.repository.CheckLogRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CheckLogResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CheckLogResourceIT {

    private static final Integer DEFAULT_I_D_CHECK_LOG = 1;
    private static final Integer UPDATED_I_D_CHECK_LOG = 2;

    private static final ZonedDateTime DEFAULT_IN_DATE_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_IN_DATE_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_OUT_DATE_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_OUT_DATE_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/check-logs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CheckLogRepository checkLogRepository;

    @Mock
    private CheckLogRepository checkLogRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCheckLogMockMvc;

    private CheckLog checkLog;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CheckLog createEntity(EntityManager em) {
        CheckLog checkLog = new CheckLog()
            .iDCheckLog(DEFAULT_I_D_CHECK_LOG)
            .inDateTime(DEFAULT_IN_DATE_TIME)
            .outDateTime(DEFAULT_OUT_DATE_TIME);
        return checkLog;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CheckLog createUpdatedEntity(EntityManager em) {
        CheckLog checkLog = new CheckLog()
            .iDCheckLog(UPDATED_I_D_CHECK_LOG)
            .inDateTime(UPDATED_IN_DATE_TIME)
            .outDateTime(UPDATED_OUT_DATE_TIME);
        return checkLog;
    }

    @BeforeEach
    public void initTest() {
        checkLog = createEntity(em);
    }

    @Test
    @Transactional
    void createCheckLog() throws Exception {
        int databaseSizeBeforeCreate = checkLogRepository.findAll().size();
        // Create the CheckLog
        restCheckLogMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(checkLog))
            )
            .andExpect(status().isCreated());

        // Validate the CheckLog in the database
        List<CheckLog> checkLogList = checkLogRepository.findAll();
        assertThat(checkLogList).hasSize(databaseSizeBeforeCreate + 1);
        CheckLog testCheckLog = checkLogList.get(checkLogList.size() - 1);
        assertThat(testCheckLog.getiDCheckLog()).isEqualTo(DEFAULT_I_D_CHECK_LOG);
        assertThat(testCheckLog.getInDateTime()).isEqualTo(DEFAULT_IN_DATE_TIME);
        assertThat(testCheckLog.getOutDateTime()).isEqualTo(DEFAULT_OUT_DATE_TIME);
    }

    @Test
    @Transactional
    void createCheckLogWithExistingId() throws Exception {
        // Create the CheckLog with an existing ID
        checkLog.setId(1L);

        int databaseSizeBeforeCreate = checkLogRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCheckLogMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(checkLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckLog in the database
        List<CheckLog> checkLogList = checkLogRepository.findAll();
        assertThat(checkLogList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkiDCheckLogIsRequired() throws Exception {
        int databaseSizeBeforeTest = checkLogRepository.findAll().size();
        // set the field null
        checkLog.setiDCheckLog(null);

        // Create the CheckLog, which fails.

        restCheckLogMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(checkLog))
            )
            .andExpect(status().isBadRequest());

        List<CheckLog> checkLogList = checkLogRepository.findAll();
        assertThat(checkLogList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCheckLogs() throws Exception {
        // Initialize the database
        checkLogRepository.saveAndFlush(checkLog);

        // Get all the checkLogList
        restCheckLogMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(checkLog.getId().intValue())))
            .andExpect(jsonPath("$.[*].iDCheckLog").value(hasItem(DEFAULT_I_D_CHECK_LOG)))
            .andExpect(jsonPath("$.[*].inDateTime").value(hasItem(sameInstant(DEFAULT_IN_DATE_TIME))))
            .andExpect(jsonPath("$.[*].outDateTime").value(hasItem(sameInstant(DEFAULT_OUT_DATE_TIME))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCheckLogsWithEagerRelationshipsIsEnabled() throws Exception {
        when(checkLogRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCheckLogMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(checkLogRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCheckLogsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(checkLogRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCheckLogMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(checkLogRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getCheckLog() throws Exception {
        // Initialize the database
        checkLogRepository.saveAndFlush(checkLog);

        // Get the checkLog
        restCheckLogMockMvc
            .perform(get(ENTITY_API_URL_ID, checkLog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(checkLog.getId().intValue()))
            .andExpect(jsonPath("$.iDCheckLog").value(DEFAULT_I_D_CHECK_LOG))
            .andExpect(jsonPath("$.inDateTime").value(sameInstant(DEFAULT_IN_DATE_TIME)))
            .andExpect(jsonPath("$.outDateTime").value(sameInstant(DEFAULT_OUT_DATE_TIME)));
    }

    @Test
    @Transactional
    void getNonExistingCheckLog() throws Exception {
        // Get the checkLog
        restCheckLogMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCheckLog() throws Exception {
        // Initialize the database
        checkLogRepository.saveAndFlush(checkLog);

        int databaseSizeBeforeUpdate = checkLogRepository.findAll().size();

        // Update the checkLog
        CheckLog updatedCheckLog = checkLogRepository.findById(checkLog.getId()).get();
        // Disconnect from session so that the updates on updatedCheckLog are not directly saved in db
        em.detach(updatedCheckLog);
        updatedCheckLog.iDCheckLog(UPDATED_I_D_CHECK_LOG).inDateTime(UPDATED_IN_DATE_TIME).outDateTime(UPDATED_OUT_DATE_TIME);

        restCheckLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCheckLog.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCheckLog))
            )
            .andExpect(status().isOk());

        // Validate the CheckLog in the database
        List<CheckLog> checkLogList = checkLogRepository.findAll();
        assertThat(checkLogList).hasSize(databaseSizeBeforeUpdate);
        CheckLog testCheckLog = checkLogList.get(checkLogList.size() - 1);
        assertThat(testCheckLog.getiDCheckLog()).isEqualTo(UPDATED_I_D_CHECK_LOG);
        assertThat(testCheckLog.getInDateTime()).isEqualTo(UPDATED_IN_DATE_TIME);
        assertThat(testCheckLog.getOutDateTime()).isEqualTo(UPDATED_OUT_DATE_TIME);
    }

    @Test
    @Transactional
    void putNonExistingCheckLog() throws Exception {
        int databaseSizeBeforeUpdate = checkLogRepository.findAll().size();
        checkLog.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCheckLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, checkLog.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(checkLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckLog in the database
        List<CheckLog> checkLogList = checkLogRepository.findAll();
        assertThat(checkLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCheckLog() throws Exception {
        int databaseSizeBeforeUpdate = checkLogRepository.findAll().size();
        checkLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(checkLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckLog in the database
        List<CheckLog> checkLogList = checkLogRepository.findAll();
        assertThat(checkLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCheckLog() throws Exception {
        int databaseSizeBeforeUpdate = checkLogRepository.findAll().size();
        checkLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckLogMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(checkLog))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CheckLog in the database
        List<CheckLog> checkLogList = checkLogRepository.findAll();
        assertThat(checkLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCheckLogWithPatch() throws Exception {
        // Initialize the database
        checkLogRepository.saveAndFlush(checkLog);

        int databaseSizeBeforeUpdate = checkLogRepository.findAll().size();

        // Update the checkLog using partial update
        CheckLog partialUpdatedCheckLog = new CheckLog();
        partialUpdatedCheckLog.setId(checkLog.getId());

        partialUpdatedCheckLog.iDCheckLog(UPDATED_I_D_CHECK_LOG).outDateTime(UPDATED_OUT_DATE_TIME);

        restCheckLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCheckLog.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCheckLog))
            )
            .andExpect(status().isOk());

        // Validate the CheckLog in the database
        List<CheckLog> checkLogList = checkLogRepository.findAll();
        assertThat(checkLogList).hasSize(databaseSizeBeforeUpdate);
        CheckLog testCheckLog = checkLogList.get(checkLogList.size() - 1);
        assertThat(testCheckLog.getiDCheckLog()).isEqualTo(UPDATED_I_D_CHECK_LOG);
        assertThat(testCheckLog.getInDateTime()).isEqualTo(DEFAULT_IN_DATE_TIME);
        assertThat(testCheckLog.getOutDateTime()).isEqualTo(UPDATED_OUT_DATE_TIME);
    }

    @Test
    @Transactional
    void fullUpdateCheckLogWithPatch() throws Exception {
        // Initialize the database
        checkLogRepository.saveAndFlush(checkLog);

        int databaseSizeBeforeUpdate = checkLogRepository.findAll().size();

        // Update the checkLog using partial update
        CheckLog partialUpdatedCheckLog = new CheckLog();
        partialUpdatedCheckLog.setId(checkLog.getId());

        partialUpdatedCheckLog.iDCheckLog(UPDATED_I_D_CHECK_LOG).inDateTime(UPDATED_IN_DATE_TIME).outDateTime(UPDATED_OUT_DATE_TIME);

        restCheckLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCheckLog.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCheckLog))
            )
            .andExpect(status().isOk());

        // Validate the CheckLog in the database
        List<CheckLog> checkLogList = checkLogRepository.findAll();
        assertThat(checkLogList).hasSize(databaseSizeBeforeUpdate);
        CheckLog testCheckLog = checkLogList.get(checkLogList.size() - 1);
        assertThat(testCheckLog.getiDCheckLog()).isEqualTo(UPDATED_I_D_CHECK_LOG);
        assertThat(testCheckLog.getInDateTime()).isEqualTo(UPDATED_IN_DATE_TIME);
        assertThat(testCheckLog.getOutDateTime()).isEqualTo(UPDATED_OUT_DATE_TIME);
    }

    @Test
    @Transactional
    void patchNonExistingCheckLog() throws Exception {
        int databaseSizeBeforeUpdate = checkLogRepository.findAll().size();
        checkLog.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCheckLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, checkLog.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(checkLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckLog in the database
        List<CheckLog> checkLogList = checkLogRepository.findAll();
        assertThat(checkLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCheckLog() throws Exception {
        int databaseSizeBeforeUpdate = checkLogRepository.findAll().size();
        checkLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(checkLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckLog in the database
        List<CheckLog> checkLogList = checkLogRepository.findAll();
        assertThat(checkLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCheckLog() throws Exception {
        int databaseSizeBeforeUpdate = checkLogRepository.findAll().size();
        checkLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckLogMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(checkLog))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CheckLog in the database
        List<CheckLog> checkLogList = checkLogRepository.findAll();
        assertThat(checkLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCheckLog() throws Exception {
        // Initialize the database
        checkLogRepository.saveAndFlush(checkLog);

        int databaseSizeBeforeDelete = checkLogRepository.findAll().size();

        // Delete the checkLog
        restCheckLogMockMvc
            .perform(delete(ENTITY_API_URL_ID, checkLog.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CheckLog> checkLogList = checkLogRepository.findAll();
        assertThat(checkLogList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

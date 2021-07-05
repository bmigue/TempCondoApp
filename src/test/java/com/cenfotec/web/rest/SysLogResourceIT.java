package com.cenfotec.web.rest;

import static com.cenfotec.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.IntegrationTest;
import com.cenfotec.domain.SysLog;
import com.cenfotec.repository.SysLogRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SysLogResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SysLogResourceIT {

    private static final Integer DEFAULT_I_D_SYS_LOG = 1;
    private static final Integer UPDATED_I_D_SYS_LOG = 2;

    private static final ZonedDateTime DEFAULT_LOG_DATE_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LOG_DATE_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_ACTION = "AAAAAAAAAA";
    private static final String UPDATED_ACTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sys-logs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SysLogRepository sysLogRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSysLogMockMvc;

    private SysLog sysLog;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SysLog createEntity(EntityManager em) {
        SysLog sysLog = new SysLog().iDSysLog(DEFAULT_I_D_SYS_LOG).logDateTime(DEFAULT_LOG_DATE_TIME).action(DEFAULT_ACTION);
        return sysLog;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SysLog createUpdatedEntity(EntityManager em) {
        SysLog sysLog = new SysLog().iDSysLog(UPDATED_I_D_SYS_LOG).logDateTime(UPDATED_LOG_DATE_TIME).action(UPDATED_ACTION);
        return sysLog;
    }

    @BeforeEach
    public void initTest() {
        sysLog = createEntity(em);
    }

    @Test
    @Transactional
    void createSysLog() throws Exception {
        int databaseSizeBeforeCreate = sysLogRepository.findAll().size();
        // Create the SysLog
        restSysLogMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sysLog))
            )
            .andExpect(status().isCreated());

        // Validate the SysLog in the database
        List<SysLog> sysLogList = sysLogRepository.findAll();
        assertThat(sysLogList).hasSize(databaseSizeBeforeCreate + 1);
        SysLog testSysLog = sysLogList.get(sysLogList.size() - 1);
        assertThat(testSysLog.getiDSysLog()).isEqualTo(DEFAULT_I_D_SYS_LOG);
        assertThat(testSysLog.getLogDateTime()).isEqualTo(DEFAULT_LOG_DATE_TIME);
        assertThat(testSysLog.getAction()).isEqualTo(DEFAULT_ACTION);
    }

    @Test
    @Transactional
    void createSysLogWithExistingId() throws Exception {
        // Create the SysLog with an existing ID
        sysLog.setId(1L);

        int databaseSizeBeforeCreate = sysLogRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSysLogMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sysLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the SysLog in the database
        List<SysLog> sysLogList = sysLogRepository.findAll();
        assertThat(sysLogList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkiDSysLogIsRequired() throws Exception {
        int databaseSizeBeforeTest = sysLogRepository.findAll().size();
        // set the field null
        sysLog.setiDSysLog(null);

        // Create the SysLog, which fails.

        restSysLogMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sysLog))
            )
            .andExpect(status().isBadRequest());

        List<SysLog> sysLogList = sysLogRepository.findAll();
        assertThat(sysLogList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSysLogs() throws Exception {
        // Initialize the database
        sysLogRepository.saveAndFlush(sysLog);

        // Get all the sysLogList
        restSysLogMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sysLog.getId().intValue())))
            .andExpect(jsonPath("$.[*].iDSysLog").value(hasItem(DEFAULT_I_D_SYS_LOG)))
            .andExpect(jsonPath("$.[*].logDateTime").value(hasItem(sameInstant(DEFAULT_LOG_DATE_TIME))))
            .andExpect(jsonPath("$.[*].action").value(hasItem(DEFAULT_ACTION)));
    }

    @Test
    @Transactional
    void getSysLog() throws Exception {
        // Initialize the database
        sysLogRepository.saveAndFlush(sysLog);

        // Get the sysLog
        restSysLogMockMvc
            .perform(get(ENTITY_API_URL_ID, sysLog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sysLog.getId().intValue()))
            .andExpect(jsonPath("$.iDSysLog").value(DEFAULT_I_D_SYS_LOG))
            .andExpect(jsonPath("$.logDateTime").value(sameInstant(DEFAULT_LOG_DATE_TIME)))
            .andExpect(jsonPath("$.action").value(DEFAULT_ACTION));
    }

    @Test
    @Transactional
    void getNonExistingSysLog() throws Exception {
        // Get the sysLog
        restSysLogMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSysLog() throws Exception {
        // Initialize the database
        sysLogRepository.saveAndFlush(sysLog);

        int databaseSizeBeforeUpdate = sysLogRepository.findAll().size();

        // Update the sysLog
        SysLog updatedSysLog = sysLogRepository.findById(sysLog.getId()).get();
        // Disconnect from session so that the updates on updatedSysLog are not directly saved in db
        em.detach(updatedSysLog);
        updatedSysLog.iDSysLog(UPDATED_I_D_SYS_LOG).logDateTime(UPDATED_LOG_DATE_TIME).action(UPDATED_ACTION);

        restSysLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSysLog.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSysLog))
            )
            .andExpect(status().isOk());

        // Validate the SysLog in the database
        List<SysLog> sysLogList = sysLogRepository.findAll();
        assertThat(sysLogList).hasSize(databaseSizeBeforeUpdate);
        SysLog testSysLog = sysLogList.get(sysLogList.size() - 1);
        assertThat(testSysLog.getiDSysLog()).isEqualTo(UPDATED_I_D_SYS_LOG);
        assertThat(testSysLog.getLogDateTime()).isEqualTo(UPDATED_LOG_DATE_TIME);
        assertThat(testSysLog.getAction()).isEqualTo(UPDATED_ACTION);
    }

    @Test
    @Transactional
    void putNonExistingSysLog() throws Exception {
        int databaseSizeBeforeUpdate = sysLogRepository.findAll().size();
        sysLog.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSysLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sysLog.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sysLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the SysLog in the database
        List<SysLog> sysLogList = sysLogRepository.findAll();
        assertThat(sysLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSysLog() throws Exception {
        int databaseSizeBeforeUpdate = sysLogRepository.findAll().size();
        sysLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSysLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sysLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the SysLog in the database
        List<SysLog> sysLogList = sysLogRepository.findAll();
        assertThat(sysLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSysLog() throws Exception {
        int databaseSizeBeforeUpdate = sysLogRepository.findAll().size();
        sysLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSysLogMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sysLog))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SysLog in the database
        List<SysLog> sysLogList = sysLogRepository.findAll();
        assertThat(sysLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSysLogWithPatch() throws Exception {
        // Initialize the database
        sysLogRepository.saveAndFlush(sysLog);

        int databaseSizeBeforeUpdate = sysLogRepository.findAll().size();

        // Update the sysLog using partial update
        SysLog partialUpdatedSysLog = new SysLog();
        partialUpdatedSysLog.setId(sysLog.getId());

        partialUpdatedSysLog.action(UPDATED_ACTION);

        restSysLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSysLog.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSysLog))
            )
            .andExpect(status().isOk());

        // Validate the SysLog in the database
        List<SysLog> sysLogList = sysLogRepository.findAll();
        assertThat(sysLogList).hasSize(databaseSizeBeforeUpdate);
        SysLog testSysLog = sysLogList.get(sysLogList.size() - 1);
        assertThat(testSysLog.getiDSysLog()).isEqualTo(DEFAULT_I_D_SYS_LOG);
        assertThat(testSysLog.getLogDateTime()).isEqualTo(DEFAULT_LOG_DATE_TIME);
        assertThat(testSysLog.getAction()).isEqualTo(UPDATED_ACTION);
    }

    @Test
    @Transactional
    void fullUpdateSysLogWithPatch() throws Exception {
        // Initialize the database
        sysLogRepository.saveAndFlush(sysLog);

        int databaseSizeBeforeUpdate = sysLogRepository.findAll().size();

        // Update the sysLog using partial update
        SysLog partialUpdatedSysLog = new SysLog();
        partialUpdatedSysLog.setId(sysLog.getId());

        partialUpdatedSysLog.iDSysLog(UPDATED_I_D_SYS_LOG).logDateTime(UPDATED_LOG_DATE_TIME).action(UPDATED_ACTION);

        restSysLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSysLog.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSysLog))
            )
            .andExpect(status().isOk());

        // Validate the SysLog in the database
        List<SysLog> sysLogList = sysLogRepository.findAll();
        assertThat(sysLogList).hasSize(databaseSizeBeforeUpdate);
        SysLog testSysLog = sysLogList.get(sysLogList.size() - 1);
        assertThat(testSysLog.getiDSysLog()).isEqualTo(UPDATED_I_D_SYS_LOG);
        assertThat(testSysLog.getLogDateTime()).isEqualTo(UPDATED_LOG_DATE_TIME);
        assertThat(testSysLog.getAction()).isEqualTo(UPDATED_ACTION);
    }

    @Test
    @Transactional
    void patchNonExistingSysLog() throws Exception {
        int databaseSizeBeforeUpdate = sysLogRepository.findAll().size();
        sysLog.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSysLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sysLog.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sysLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the SysLog in the database
        List<SysLog> sysLogList = sysLogRepository.findAll();
        assertThat(sysLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSysLog() throws Exception {
        int databaseSizeBeforeUpdate = sysLogRepository.findAll().size();
        sysLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSysLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sysLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the SysLog in the database
        List<SysLog> sysLogList = sysLogRepository.findAll();
        assertThat(sysLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSysLog() throws Exception {
        int databaseSizeBeforeUpdate = sysLogRepository.findAll().size();
        sysLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSysLogMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sysLog))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SysLog in the database
        List<SysLog> sysLogList = sysLogRepository.findAll();
        assertThat(sysLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSysLog() throws Exception {
        // Initialize the database
        sysLogRepository.saveAndFlush(sysLog);

        int databaseSizeBeforeDelete = sysLogRepository.findAll().size();

        // Delete the sysLog
        restSysLogMockMvc
            .perform(delete(ENTITY_API_URL_ID, sysLog.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SysLog> sysLogList = sysLogRepository.findAll();
        assertThat(sysLogList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

package com.cenfotec.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.IntegrationTest;
import com.cenfotec.domain.ExceptionTable;
import com.cenfotec.repository.ExceptionTableRepository;
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
 * Integration tests for the {@link ExceptionTableResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ExceptionTableResourceIT {

    private static final Integer DEFAULT_I_D_EXCEPTION = 1;
    private static final Integer UPDATED_I_D_EXCEPTION = 2;

    private static final String DEFAULT_MESSAGE = "AAAAAAAAAA";
    private static final String UPDATED_MESSAGE = "BBBBBBBBBB";

    private static final Integer DEFAULT_NUMBER = 1;
    private static final Integer UPDATED_NUMBER = 2;

    private static final String ENTITY_API_URL = "/api/exception-tables";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ExceptionTableRepository exceptionTableRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExceptionTableMockMvc;

    private ExceptionTable exceptionTable;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExceptionTable createEntity(EntityManager em) {
        ExceptionTable exceptionTable = new ExceptionTable()
            .iDException(DEFAULT_I_D_EXCEPTION)
            .message(DEFAULT_MESSAGE)
            .number(DEFAULT_NUMBER);
        return exceptionTable;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExceptionTable createUpdatedEntity(EntityManager em) {
        ExceptionTable exceptionTable = new ExceptionTable()
            .iDException(UPDATED_I_D_EXCEPTION)
            .message(UPDATED_MESSAGE)
            .number(UPDATED_NUMBER);
        return exceptionTable;
    }

    @BeforeEach
    public void initTest() {
        exceptionTable = createEntity(em);
    }

    @Test
    @Transactional
    void createExceptionTable() throws Exception {
        int databaseSizeBeforeCreate = exceptionTableRepository.findAll().size();
        // Create the ExceptionTable
        restExceptionTableMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(exceptionTable))
            )
            .andExpect(status().isCreated());

        // Validate the ExceptionTable in the database
        List<ExceptionTable> exceptionTableList = exceptionTableRepository.findAll();
        assertThat(exceptionTableList).hasSize(databaseSizeBeforeCreate + 1);
        ExceptionTable testExceptionTable = exceptionTableList.get(exceptionTableList.size() - 1);
        assertThat(testExceptionTable.getiDException()).isEqualTo(DEFAULT_I_D_EXCEPTION);
        assertThat(testExceptionTable.getMessage()).isEqualTo(DEFAULT_MESSAGE);
        assertThat(testExceptionTable.getNumber()).isEqualTo(DEFAULT_NUMBER);
    }

    @Test
    @Transactional
    void createExceptionTableWithExistingId() throws Exception {
        // Create the ExceptionTable with an existing ID
        exceptionTable.setId(1L);

        int databaseSizeBeforeCreate = exceptionTableRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExceptionTableMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(exceptionTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExceptionTable in the database
        List<ExceptionTable> exceptionTableList = exceptionTableRepository.findAll();
        assertThat(exceptionTableList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkiDExceptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = exceptionTableRepository.findAll().size();
        // set the field null
        exceptionTable.setiDException(null);

        // Create the ExceptionTable, which fails.

        restExceptionTableMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(exceptionTable))
            )
            .andExpect(status().isBadRequest());

        List<ExceptionTable> exceptionTableList = exceptionTableRepository.findAll();
        assertThat(exceptionTableList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllExceptionTables() throws Exception {
        // Initialize the database
        exceptionTableRepository.saveAndFlush(exceptionTable);

        // Get all the exceptionTableList
        restExceptionTableMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(exceptionTable.getId().intValue())))
            .andExpect(jsonPath("$.[*].iDException").value(hasItem(DEFAULT_I_D_EXCEPTION)))
            .andExpect(jsonPath("$.[*].message").value(hasItem(DEFAULT_MESSAGE)))
            .andExpect(jsonPath("$.[*].number").value(hasItem(DEFAULT_NUMBER)));
    }

    @Test
    @Transactional
    void getExceptionTable() throws Exception {
        // Initialize the database
        exceptionTableRepository.saveAndFlush(exceptionTable);

        // Get the exceptionTable
        restExceptionTableMockMvc
            .perform(get(ENTITY_API_URL_ID, exceptionTable.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(exceptionTable.getId().intValue()))
            .andExpect(jsonPath("$.iDException").value(DEFAULT_I_D_EXCEPTION))
            .andExpect(jsonPath("$.message").value(DEFAULT_MESSAGE))
            .andExpect(jsonPath("$.number").value(DEFAULT_NUMBER));
    }

    @Test
    @Transactional
    void getNonExistingExceptionTable() throws Exception {
        // Get the exceptionTable
        restExceptionTableMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewExceptionTable() throws Exception {
        // Initialize the database
        exceptionTableRepository.saveAndFlush(exceptionTable);

        int databaseSizeBeforeUpdate = exceptionTableRepository.findAll().size();

        // Update the exceptionTable
        ExceptionTable updatedExceptionTable = exceptionTableRepository.findById(exceptionTable.getId()).get();
        // Disconnect from session so that the updates on updatedExceptionTable are not directly saved in db
        em.detach(updatedExceptionTable);
        updatedExceptionTable.iDException(UPDATED_I_D_EXCEPTION).message(UPDATED_MESSAGE).number(UPDATED_NUMBER);

        restExceptionTableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedExceptionTable.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedExceptionTable))
            )
            .andExpect(status().isOk());

        // Validate the ExceptionTable in the database
        List<ExceptionTable> exceptionTableList = exceptionTableRepository.findAll();
        assertThat(exceptionTableList).hasSize(databaseSizeBeforeUpdate);
        ExceptionTable testExceptionTable = exceptionTableList.get(exceptionTableList.size() - 1);
        assertThat(testExceptionTable.getiDException()).isEqualTo(UPDATED_I_D_EXCEPTION);
        assertThat(testExceptionTable.getMessage()).isEqualTo(UPDATED_MESSAGE);
        assertThat(testExceptionTable.getNumber()).isEqualTo(UPDATED_NUMBER);
    }

    @Test
    @Transactional
    void putNonExistingExceptionTable() throws Exception {
        int databaseSizeBeforeUpdate = exceptionTableRepository.findAll().size();
        exceptionTable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExceptionTableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, exceptionTable.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(exceptionTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExceptionTable in the database
        List<ExceptionTable> exceptionTableList = exceptionTableRepository.findAll();
        assertThat(exceptionTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExceptionTable() throws Exception {
        int databaseSizeBeforeUpdate = exceptionTableRepository.findAll().size();
        exceptionTable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExceptionTableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(exceptionTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExceptionTable in the database
        List<ExceptionTable> exceptionTableList = exceptionTableRepository.findAll();
        assertThat(exceptionTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExceptionTable() throws Exception {
        int databaseSizeBeforeUpdate = exceptionTableRepository.findAll().size();
        exceptionTable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExceptionTableMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(exceptionTable))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExceptionTable in the database
        List<ExceptionTable> exceptionTableList = exceptionTableRepository.findAll();
        assertThat(exceptionTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExceptionTableWithPatch() throws Exception {
        // Initialize the database
        exceptionTableRepository.saveAndFlush(exceptionTable);

        int databaseSizeBeforeUpdate = exceptionTableRepository.findAll().size();

        // Update the exceptionTable using partial update
        ExceptionTable partialUpdatedExceptionTable = new ExceptionTable();
        partialUpdatedExceptionTable.setId(exceptionTable.getId());

        partialUpdatedExceptionTable.iDException(UPDATED_I_D_EXCEPTION).message(UPDATED_MESSAGE).number(UPDATED_NUMBER);

        restExceptionTableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExceptionTable.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExceptionTable))
            )
            .andExpect(status().isOk());

        // Validate the ExceptionTable in the database
        List<ExceptionTable> exceptionTableList = exceptionTableRepository.findAll();
        assertThat(exceptionTableList).hasSize(databaseSizeBeforeUpdate);
        ExceptionTable testExceptionTable = exceptionTableList.get(exceptionTableList.size() - 1);
        assertThat(testExceptionTable.getiDException()).isEqualTo(UPDATED_I_D_EXCEPTION);
        assertThat(testExceptionTable.getMessage()).isEqualTo(UPDATED_MESSAGE);
        assertThat(testExceptionTable.getNumber()).isEqualTo(UPDATED_NUMBER);
    }

    @Test
    @Transactional
    void fullUpdateExceptionTableWithPatch() throws Exception {
        // Initialize the database
        exceptionTableRepository.saveAndFlush(exceptionTable);

        int databaseSizeBeforeUpdate = exceptionTableRepository.findAll().size();

        // Update the exceptionTable using partial update
        ExceptionTable partialUpdatedExceptionTable = new ExceptionTable();
        partialUpdatedExceptionTable.setId(exceptionTable.getId());

        partialUpdatedExceptionTable.iDException(UPDATED_I_D_EXCEPTION).message(UPDATED_MESSAGE).number(UPDATED_NUMBER);

        restExceptionTableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExceptionTable.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExceptionTable))
            )
            .andExpect(status().isOk());

        // Validate the ExceptionTable in the database
        List<ExceptionTable> exceptionTableList = exceptionTableRepository.findAll();
        assertThat(exceptionTableList).hasSize(databaseSizeBeforeUpdate);
        ExceptionTable testExceptionTable = exceptionTableList.get(exceptionTableList.size() - 1);
        assertThat(testExceptionTable.getiDException()).isEqualTo(UPDATED_I_D_EXCEPTION);
        assertThat(testExceptionTable.getMessage()).isEqualTo(UPDATED_MESSAGE);
        assertThat(testExceptionTable.getNumber()).isEqualTo(UPDATED_NUMBER);
    }

    @Test
    @Transactional
    void patchNonExistingExceptionTable() throws Exception {
        int databaseSizeBeforeUpdate = exceptionTableRepository.findAll().size();
        exceptionTable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExceptionTableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, exceptionTable.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(exceptionTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExceptionTable in the database
        List<ExceptionTable> exceptionTableList = exceptionTableRepository.findAll();
        assertThat(exceptionTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExceptionTable() throws Exception {
        int databaseSizeBeforeUpdate = exceptionTableRepository.findAll().size();
        exceptionTable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExceptionTableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(exceptionTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExceptionTable in the database
        List<ExceptionTable> exceptionTableList = exceptionTableRepository.findAll();
        assertThat(exceptionTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExceptionTable() throws Exception {
        int databaseSizeBeforeUpdate = exceptionTableRepository.findAll().size();
        exceptionTable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExceptionTableMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(exceptionTable))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExceptionTable in the database
        List<ExceptionTable> exceptionTableList = exceptionTableRepository.findAll();
        assertThat(exceptionTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExceptionTable() throws Exception {
        // Initialize the database
        exceptionTableRepository.saveAndFlush(exceptionTable);

        int databaseSizeBeforeDelete = exceptionTableRepository.findAll().size();

        // Delete the exceptionTable
        restExceptionTableMockMvc
            .perform(delete(ENTITY_API_URL_ID, exceptionTable.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ExceptionTable> exceptionTableList = exceptionTableRepository.findAll();
        assertThat(exceptionTableList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

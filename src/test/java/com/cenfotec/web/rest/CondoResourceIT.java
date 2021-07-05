package com.cenfotec.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.IntegrationTest;
import com.cenfotec.domain.Condo;
import com.cenfotec.repository.CondoRepository;
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
 * Integration tests for the {@link CondoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CondoResourceIT {

    private static final Integer DEFAULT_I_D_CONDO = 1;
    private static final Integer UPDATED_I_D_CONDO = 2;

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/condos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CondoRepository condoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCondoMockMvc;

    private Condo condo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Condo createEntity(EntityManager em) {
        Condo condo = new Condo().iDCondo(DEFAULT_I_D_CONDO).nombre(DEFAULT_NOMBRE);
        return condo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Condo createUpdatedEntity(EntityManager em) {
        Condo condo = new Condo().iDCondo(UPDATED_I_D_CONDO).nombre(UPDATED_NOMBRE);
        return condo;
    }

    @BeforeEach
    public void initTest() {
        condo = createEntity(em);
    }

    @Test
    @Transactional
    void createCondo() throws Exception {
        int databaseSizeBeforeCreate = condoRepository.findAll().size();
        // Create the Condo
        restCondoMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(condo))
            )
            .andExpect(status().isCreated());

        // Validate the Condo in the database
        List<Condo> condoList = condoRepository.findAll();
        assertThat(condoList).hasSize(databaseSizeBeforeCreate + 1);
        Condo testCondo = condoList.get(condoList.size() - 1);
        assertThat(testCondo.getiDCondo()).isEqualTo(DEFAULT_I_D_CONDO);
        assertThat(testCondo.getNombre()).isEqualTo(DEFAULT_NOMBRE);
    }

    @Test
    @Transactional
    void createCondoWithExistingId() throws Exception {
        // Create the Condo with an existing ID
        condo.setId(1L);

        int databaseSizeBeforeCreate = condoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCondoMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(condo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Condo in the database
        List<Condo> condoList = condoRepository.findAll();
        assertThat(condoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkiDCondoIsRequired() throws Exception {
        int databaseSizeBeforeTest = condoRepository.findAll().size();
        // set the field null
        condo.setiDCondo(null);

        // Create the Condo, which fails.

        restCondoMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(condo))
            )
            .andExpect(status().isBadRequest());

        List<Condo> condoList = condoRepository.findAll();
        assertThat(condoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCondos() throws Exception {
        // Initialize the database
        condoRepository.saveAndFlush(condo);

        // Get all the condoList
        restCondoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(condo.getId().intValue())))
            .andExpect(jsonPath("$.[*].iDCondo").value(hasItem(DEFAULT_I_D_CONDO)))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)));
    }

    @Test
    @Transactional
    void getCondo() throws Exception {
        // Initialize the database
        condoRepository.saveAndFlush(condo);

        // Get the condo
        restCondoMockMvc
            .perform(get(ENTITY_API_URL_ID, condo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(condo.getId().intValue()))
            .andExpect(jsonPath("$.iDCondo").value(DEFAULT_I_D_CONDO))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE));
    }

    @Test
    @Transactional
    void getNonExistingCondo() throws Exception {
        // Get the condo
        restCondoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCondo() throws Exception {
        // Initialize the database
        condoRepository.saveAndFlush(condo);

        int databaseSizeBeforeUpdate = condoRepository.findAll().size();

        // Update the condo
        Condo updatedCondo = condoRepository.findById(condo.getId()).get();
        // Disconnect from session so that the updates on updatedCondo are not directly saved in db
        em.detach(updatedCondo);
        updatedCondo.iDCondo(UPDATED_I_D_CONDO).nombre(UPDATED_NOMBRE);

        restCondoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCondo.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCondo))
            )
            .andExpect(status().isOk());

        // Validate the Condo in the database
        List<Condo> condoList = condoRepository.findAll();
        assertThat(condoList).hasSize(databaseSizeBeforeUpdate);
        Condo testCondo = condoList.get(condoList.size() - 1);
        assertThat(testCondo.getiDCondo()).isEqualTo(UPDATED_I_D_CONDO);
        assertThat(testCondo.getNombre()).isEqualTo(UPDATED_NOMBRE);
    }

    @Test
    @Transactional
    void putNonExistingCondo() throws Exception {
        int databaseSizeBeforeUpdate = condoRepository.findAll().size();
        condo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCondoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, condo.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(condo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Condo in the database
        List<Condo> condoList = condoRepository.findAll();
        assertThat(condoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCondo() throws Exception {
        int databaseSizeBeforeUpdate = condoRepository.findAll().size();
        condo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCondoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(condo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Condo in the database
        List<Condo> condoList = condoRepository.findAll();
        assertThat(condoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCondo() throws Exception {
        int databaseSizeBeforeUpdate = condoRepository.findAll().size();
        condo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCondoMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(condo))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Condo in the database
        List<Condo> condoList = condoRepository.findAll();
        assertThat(condoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCondoWithPatch() throws Exception {
        // Initialize the database
        condoRepository.saveAndFlush(condo);

        int databaseSizeBeforeUpdate = condoRepository.findAll().size();

        // Update the condo using partial update
        Condo partialUpdatedCondo = new Condo();
        partialUpdatedCondo.setId(condo.getId());

        restCondoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCondo.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCondo))
            )
            .andExpect(status().isOk());

        // Validate the Condo in the database
        List<Condo> condoList = condoRepository.findAll();
        assertThat(condoList).hasSize(databaseSizeBeforeUpdate);
        Condo testCondo = condoList.get(condoList.size() - 1);
        assertThat(testCondo.getiDCondo()).isEqualTo(DEFAULT_I_D_CONDO);
        assertThat(testCondo.getNombre()).isEqualTo(DEFAULT_NOMBRE);
    }

    @Test
    @Transactional
    void fullUpdateCondoWithPatch() throws Exception {
        // Initialize the database
        condoRepository.saveAndFlush(condo);

        int databaseSizeBeforeUpdate = condoRepository.findAll().size();

        // Update the condo using partial update
        Condo partialUpdatedCondo = new Condo();
        partialUpdatedCondo.setId(condo.getId());

        partialUpdatedCondo.iDCondo(UPDATED_I_D_CONDO).nombre(UPDATED_NOMBRE);

        restCondoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCondo.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCondo))
            )
            .andExpect(status().isOk());

        // Validate the Condo in the database
        List<Condo> condoList = condoRepository.findAll();
        assertThat(condoList).hasSize(databaseSizeBeforeUpdate);
        Condo testCondo = condoList.get(condoList.size() - 1);
        assertThat(testCondo.getiDCondo()).isEqualTo(UPDATED_I_D_CONDO);
        assertThat(testCondo.getNombre()).isEqualTo(UPDATED_NOMBRE);
    }

    @Test
    @Transactional
    void patchNonExistingCondo() throws Exception {
        int databaseSizeBeforeUpdate = condoRepository.findAll().size();
        condo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCondoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, condo.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(condo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Condo in the database
        List<Condo> condoList = condoRepository.findAll();
        assertThat(condoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCondo() throws Exception {
        int databaseSizeBeforeUpdate = condoRepository.findAll().size();
        condo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCondoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(condo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Condo in the database
        List<Condo> condoList = condoRepository.findAll();
        assertThat(condoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCondo() throws Exception {
        int databaseSizeBeforeUpdate = condoRepository.findAll().size();
        condo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCondoMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(condo))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Condo in the database
        List<Condo> condoList = condoRepository.findAll();
        assertThat(condoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCondo() throws Exception {
        // Initialize the database
        condoRepository.saveAndFlush(condo);

        int databaseSizeBeforeDelete = condoRepository.findAll().size();

        // Delete the condo
        restCondoMockMvc
            .perform(delete(ENTITY_API_URL_ID, condo.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Condo> condoList = condoRepository.findAll();
        assertThat(condoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

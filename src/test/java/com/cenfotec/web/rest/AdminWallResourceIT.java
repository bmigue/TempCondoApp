package com.cenfotec.web.rest;

import static com.cenfotec.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.IntegrationTest;
import com.cenfotec.domain.AdminWall;
import com.cenfotec.repository.AdminWallRepository;
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
 * Integration tests for the {@link AdminWallResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AdminWallResourceIT {

    private static final Integer DEFAULT_I_D_ADMIN_WALL = 1;
    private static final Integer UPDATED_I_D_ADMIN_WALL = 2;

    private static final ZonedDateTime DEFAULT_POST_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_POST_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_POST = "AAAAAAAAAA";
    private static final String UPDATED_POST = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/admin-walls";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AdminWallRepository adminWallRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAdminWallMockMvc;

    private AdminWall adminWall;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AdminWall createEntity(EntityManager em) {
        AdminWall adminWall = new AdminWall().iDAdminWall(DEFAULT_I_D_ADMIN_WALL).postDate(DEFAULT_POST_DATE).post(DEFAULT_POST);
        return adminWall;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AdminWall createUpdatedEntity(EntityManager em) {
        AdminWall adminWall = new AdminWall().iDAdminWall(UPDATED_I_D_ADMIN_WALL).postDate(UPDATED_POST_DATE).post(UPDATED_POST);
        return adminWall;
    }

    @BeforeEach
    public void initTest() {
        adminWall = createEntity(em);
    }

    @Test
    @Transactional
    void createAdminWall() throws Exception {
        int databaseSizeBeforeCreate = adminWallRepository.findAll().size();
        // Create the AdminWall
        restAdminWallMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(adminWall))
            )
            .andExpect(status().isCreated());

        // Validate the AdminWall in the database
        List<AdminWall> adminWallList = adminWallRepository.findAll();
        assertThat(adminWallList).hasSize(databaseSizeBeforeCreate + 1);
        AdminWall testAdminWall = adminWallList.get(adminWallList.size() - 1);
        assertThat(testAdminWall.getiDAdminWall()).isEqualTo(DEFAULT_I_D_ADMIN_WALL);
        assertThat(testAdminWall.getPostDate()).isEqualTo(DEFAULT_POST_DATE);
        assertThat(testAdminWall.getPost()).isEqualTo(DEFAULT_POST);
    }

    @Test
    @Transactional
    void createAdminWallWithExistingId() throws Exception {
        // Create the AdminWall with an existing ID
        adminWall.setId(1L);

        int databaseSizeBeforeCreate = adminWallRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAdminWallMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(adminWall))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdminWall in the database
        List<AdminWall> adminWallList = adminWallRepository.findAll();
        assertThat(adminWallList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkiDAdminWallIsRequired() throws Exception {
        int databaseSizeBeforeTest = adminWallRepository.findAll().size();
        // set the field null
        adminWall.setiDAdminWall(null);

        // Create the AdminWall, which fails.

        restAdminWallMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(adminWall))
            )
            .andExpect(status().isBadRequest());

        List<AdminWall> adminWallList = adminWallRepository.findAll();
        assertThat(adminWallList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAdminWalls() throws Exception {
        // Initialize the database
        adminWallRepository.saveAndFlush(adminWall);

        // Get all the adminWallList
        restAdminWallMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(adminWall.getId().intValue())))
            .andExpect(jsonPath("$.[*].iDAdminWall").value(hasItem(DEFAULT_I_D_ADMIN_WALL)))
            .andExpect(jsonPath("$.[*].postDate").value(hasItem(sameInstant(DEFAULT_POST_DATE))))
            .andExpect(jsonPath("$.[*].post").value(hasItem(DEFAULT_POST)));
    }

    @Test
    @Transactional
    void getAdminWall() throws Exception {
        // Initialize the database
        adminWallRepository.saveAndFlush(adminWall);

        // Get the adminWall
        restAdminWallMockMvc
            .perform(get(ENTITY_API_URL_ID, adminWall.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(adminWall.getId().intValue()))
            .andExpect(jsonPath("$.iDAdminWall").value(DEFAULT_I_D_ADMIN_WALL))
            .andExpect(jsonPath("$.postDate").value(sameInstant(DEFAULT_POST_DATE)))
            .andExpect(jsonPath("$.post").value(DEFAULT_POST));
    }

    @Test
    @Transactional
    void getNonExistingAdminWall() throws Exception {
        // Get the adminWall
        restAdminWallMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAdminWall() throws Exception {
        // Initialize the database
        adminWallRepository.saveAndFlush(adminWall);

        int databaseSizeBeforeUpdate = adminWallRepository.findAll().size();

        // Update the adminWall
        AdminWall updatedAdminWall = adminWallRepository.findById(adminWall.getId()).get();
        // Disconnect from session so that the updates on updatedAdminWall are not directly saved in db
        em.detach(updatedAdminWall);
        updatedAdminWall.iDAdminWall(UPDATED_I_D_ADMIN_WALL).postDate(UPDATED_POST_DATE).post(UPDATED_POST);

        restAdminWallMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAdminWall.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAdminWall))
            )
            .andExpect(status().isOk());

        // Validate the AdminWall in the database
        List<AdminWall> adminWallList = adminWallRepository.findAll();
        assertThat(adminWallList).hasSize(databaseSizeBeforeUpdate);
        AdminWall testAdminWall = adminWallList.get(adminWallList.size() - 1);
        assertThat(testAdminWall.getiDAdminWall()).isEqualTo(UPDATED_I_D_ADMIN_WALL);
        assertThat(testAdminWall.getPostDate()).isEqualTo(UPDATED_POST_DATE);
        assertThat(testAdminWall.getPost()).isEqualTo(UPDATED_POST);
    }

    @Test
    @Transactional
    void putNonExistingAdminWall() throws Exception {
        int databaseSizeBeforeUpdate = adminWallRepository.findAll().size();
        adminWall.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdminWallMockMvc
            .perform(
                put(ENTITY_API_URL_ID, adminWall.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(adminWall))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdminWall in the database
        List<AdminWall> adminWallList = adminWallRepository.findAll();
        assertThat(adminWallList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAdminWall() throws Exception {
        int databaseSizeBeforeUpdate = adminWallRepository.findAll().size();
        adminWall.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdminWallMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(adminWall))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdminWall in the database
        List<AdminWall> adminWallList = adminWallRepository.findAll();
        assertThat(adminWallList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAdminWall() throws Exception {
        int databaseSizeBeforeUpdate = adminWallRepository.findAll().size();
        adminWall.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdminWallMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(adminWall))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AdminWall in the database
        List<AdminWall> adminWallList = adminWallRepository.findAll();
        assertThat(adminWallList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAdminWallWithPatch() throws Exception {
        // Initialize the database
        adminWallRepository.saveAndFlush(adminWall);

        int databaseSizeBeforeUpdate = adminWallRepository.findAll().size();

        // Update the adminWall using partial update
        AdminWall partialUpdatedAdminWall = new AdminWall();
        partialUpdatedAdminWall.setId(adminWall.getId());

        partialUpdatedAdminWall.post(UPDATED_POST);

        restAdminWallMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdminWall.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAdminWall))
            )
            .andExpect(status().isOk());

        // Validate the AdminWall in the database
        List<AdminWall> adminWallList = adminWallRepository.findAll();
        assertThat(adminWallList).hasSize(databaseSizeBeforeUpdate);
        AdminWall testAdminWall = adminWallList.get(adminWallList.size() - 1);
        assertThat(testAdminWall.getiDAdminWall()).isEqualTo(DEFAULT_I_D_ADMIN_WALL);
        assertThat(testAdminWall.getPostDate()).isEqualTo(DEFAULT_POST_DATE);
        assertThat(testAdminWall.getPost()).isEqualTo(UPDATED_POST);
    }

    @Test
    @Transactional
    void fullUpdateAdminWallWithPatch() throws Exception {
        // Initialize the database
        adminWallRepository.saveAndFlush(adminWall);

        int databaseSizeBeforeUpdate = adminWallRepository.findAll().size();

        // Update the adminWall using partial update
        AdminWall partialUpdatedAdminWall = new AdminWall();
        partialUpdatedAdminWall.setId(adminWall.getId());

        partialUpdatedAdminWall.iDAdminWall(UPDATED_I_D_ADMIN_WALL).postDate(UPDATED_POST_DATE).post(UPDATED_POST);

        restAdminWallMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdminWall.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAdminWall))
            )
            .andExpect(status().isOk());

        // Validate the AdminWall in the database
        List<AdminWall> adminWallList = adminWallRepository.findAll();
        assertThat(adminWallList).hasSize(databaseSizeBeforeUpdate);
        AdminWall testAdminWall = adminWallList.get(adminWallList.size() - 1);
        assertThat(testAdminWall.getiDAdminWall()).isEqualTo(UPDATED_I_D_ADMIN_WALL);
        assertThat(testAdminWall.getPostDate()).isEqualTo(UPDATED_POST_DATE);
        assertThat(testAdminWall.getPost()).isEqualTo(UPDATED_POST);
    }

    @Test
    @Transactional
    void patchNonExistingAdminWall() throws Exception {
        int databaseSizeBeforeUpdate = adminWallRepository.findAll().size();
        adminWall.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdminWallMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, adminWall.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(adminWall))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdminWall in the database
        List<AdminWall> adminWallList = adminWallRepository.findAll();
        assertThat(adminWallList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAdminWall() throws Exception {
        int databaseSizeBeforeUpdate = adminWallRepository.findAll().size();
        adminWall.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdminWallMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(adminWall))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdminWall in the database
        List<AdminWall> adminWallList = adminWallRepository.findAll();
        assertThat(adminWallList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAdminWall() throws Exception {
        int databaseSizeBeforeUpdate = adminWallRepository.findAll().size();
        adminWall.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdminWallMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(adminWall))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AdminWall in the database
        List<AdminWall> adminWallList = adminWallRepository.findAll();
        assertThat(adminWallList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAdminWall() throws Exception {
        // Initialize the database
        adminWallRepository.saveAndFlush(adminWall);

        int databaseSizeBeforeDelete = adminWallRepository.findAll().size();

        // Delete the adminWall
        restAdminWallMockMvc
            .perform(delete(ENTITY_API_URL_ID, adminWall.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AdminWall> adminWallList = adminWallRepository.findAll();
        assertThat(adminWallList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

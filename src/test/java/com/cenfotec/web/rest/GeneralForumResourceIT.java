package com.cenfotec.web.rest;

import static com.cenfotec.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.IntegrationTest;
import com.cenfotec.domain.GeneralForum;
import com.cenfotec.repository.GeneralForumRepository;
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
 * Integration tests for the {@link GeneralForumResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GeneralForumResourceIT {

    private static final Integer DEFAULT_I_D_GENERAL_FORUM = 1;
    private static final Integer UPDATED_I_D_GENERAL_FORUM = 2;

    private static final ZonedDateTime DEFAULT_POST_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_POST_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_POST = "AAAAAAAAAA";
    private static final String UPDATED_POST = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/general-forums";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GeneralForumRepository generalForumRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGeneralForumMockMvc;

    private GeneralForum generalForum;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GeneralForum createEntity(EntityManager em) {
        GeneralForum generalForum = new GeneralForum()
            .iDGeneralForum(DEFAULT_I_D_GENERAL_FORUM)
            .postDate(DEFAULT_POST_DATE)
            .post(DEFAULT_POST);
        return generalForum;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GeneralForum createUpdatedEntity(EntityManager em) {
        GeneralForum generalForum = new GeneralForum()
            .iDGeneralForum(UPDATED_I_D_GENERAL_FORUM)
            .postDate(UPDATED_POST_DATE)
            .post(UPDATED_POST);
        return generalForum;
    }

    @BeforeEach
    public void initTest() {
        generalForum = createEntity(em);
    }

    @Test
    @Transactional
    void createGeneralForum() throws Exception {
        int databaseSizeBeforeCreate = generalForumRepository.findAll().size();
        // Create the GeneralForum
        restGeneralForumMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(generalForum))
            )
            .andExpect(status().isCreated());

        // Validate the GeneralForum in the database
        List<GeneralForum> generalForumList = generalForumRepository.findAll();
        assertThat(generalForumList).hasSize(databaseSizeBeforeCreate + 1);
        GeneralForum testGeneralForum = generalForumList.get(generalForumList.size() - 1);
        assertThat(testGeneralForum.getiDGeneralForum()).isEqualTo(DEFAULT_I_D_GENERAL_FORUM);
        assertThat(testGeneralForum.getPostDate()).isEqualTo(DEFAULT_POST_DATE);
        assertThat(testGeneralForum.getPost()).isEqualTo(DEFAULT_POST);
    }

    @Test
    @Transactional
    void createGeneralForumWithExistingId() throws Exception {
        // Create the GeneralForum with an existing ID
        generalForum.setId(1L);

        int databaseSizeBeforeCreate = generalForumRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGeneralForumMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(generalForum))
            )
            .andExpect(status().isBadRequest());

        // Validate the GeneralForum in the database
        List<GeneralForum> generalForumList = generalForumRepository.findAll();
        assertThat(generalForumList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkiDGeneralForumIsRequired() throws Exception {
        int databaseSizeBeforeTest = generalForumRepository.findAll().size();
        // set the field null
        generalForum.setiDGeneralForum(null);

        // Create the GeneralForum, which fails.

        restGeneralForumMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(generalForum))
            )
            .andExpect(status().isBadRequest());

        List<GeneralForum> generalForumList = generalForumRepository.findAll();
        assertThat(generalForumList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGeneralForums() throws Exception {
        // Initialize the database
        generalForumRepository.saveAndFlush(generalForum);

        // Get all the generalForumList
        restGeneralForumMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(generalForum.getId().intValue())))
            .andExpect(jsonPath("$.[*].iDGeneralForum").value(hasItem(DEFAULT_I_D_GENERAL_FORUM)))
            .andExpect(jsonPath("$.[*].postDate").value(hasItem(sameInstant(DEFAULT_POST_DATE))))
            .andExpect(jsonPath("$.[*].post").value(hasItem(DEFAULT_POST)));
    }

    @Test
    @Transactional
    void getGeneralForum() throws Exception {
        // Initialize the database
        generalForumRepository.saveAndFlush(generalForum);

        // Get the generalForum
        restGeneralForumMockMvc
            .perform(get(ENTITY_API_URL_ID, generalForum.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(generalForum.getId().intValue()))
            .andExpect(jsonPath("$.iDGeneralForum").value(DEFAULT_I_D_GENERAL_FORUM))
            .andExpect(jsonPath("$.postDate").value(sameInstant(DEFAULT_POST_DATE)))
            .andExpect(jsonPath("$.post").value(DEFAULT_POST));
    }

    @Test
    @Transactional
    void getNonExistingGeneralForum() throws Exception {
        // Get the generalForum
        restGeneralForumMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewGeneralForum() throws Exception {
        // Initialize the database
        generalForumRepository.saveAndFlush(generalForum);

        int databaseSizeBeforeUpdate = generalForumRepository.findAll().size();

        // Update the generalForum
        GeneralForum updatedGeneralForum = generalForumRepository.findById(generalForum.getId()).get();
        // Disconnect from session so that the updates on updatedGeneralForum are not directly saved in db
        em.detach(updatedGeneralForum);
        updatedGeneralForum.iDGeneralForum(UPDATED_I_D_GENERAL_FORUM).postDate(UPDATED_POST_DATE).post(UPDATED_POST);

        restGeneralForumMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGeneralForum.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGeneralForum))
            )
            .andExpect(status().isOk());

        // Validate the GeneralForum in the database
        List<GeneralForum> generalForumList = generalForumRepository.findAll();
        assertThat(generalForumList).hasSize(databaseSizeBeforeUpdate);
        GeneralForum testGeneralForum = generalForumList.get(generalForumList.size() - 1);
        assertThat(testGeneralForum.getiDGeneralForum()).isEqualTo(UPDATED_I_D_GENERAL_FORUM);
        assertThat(testGeneralForum.getPostDate()).isEqualTo(UPDATED_POST_DATE);
        assertThat(testGeneralForum.getPost()).isEqualTo(UPDATED_POST);
    }

    @Test
    @Transactional
    void putNonExistingGeneralForum() throws Exception {
        int databaseSizeBeforeUpdate = generalForumRepository.findAll().size();
        generalForum.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGeneralForumMockMvc
            .perform(
                put(ENTITY_API_URL_ID, generalForum.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(generalForum))
            )
            .andExpect(status().isBadRequest());

        // Validate the GeneralForum in the database
        List<GeneralForum> generalForumList = generalForumRepository.findAll();
        assertThat(generalForumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGeneralForum() throws Exception {
        int databaseSizeBeforeUpdate = generalForumRepository.findAll().size();
        generalForum.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGeneralForumMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(generalForum))
            )
            .andExpect(status().isBadRequest());

        // Validate the GeneralForum in the database
        List<GeneralForum> generalForumList = generalForumRepository.findAll();
        assertThat(generalForumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGeneralForum() throws Exception {
        int databaseSizeBeforeUpdate = generalForumRepository.findAll().size();
        generalForum.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGeneralForumMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(generalForum))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GeneralForum in the database
        List<GeneralForum> generalForumList = generalForumRepository.findAll();
        assertThat(generalForumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGeneralForumWithPatch() throws Exception {
        // Initialize the database
        generalForumRepository.saveAndFlush(generalForum);

        int databaseSizeBeforeUpdate = generalForumRepository.findAll().size();

        // Update the generalForum using partial update
        GeneralForum partialUpdatedGeneralForum = new GeneralForum();
        partialUpdatedGeneralForum.setId(generalForum.getId());

        restGeneralForumMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGeneralForum.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGeneralForum))
            )
            .andExpect(status().isOk());

        // Validate the GeneralForum in the database
        List<GeneralForum> generalForumList = generalForumRepository.findAll();
        assertThat(generalForumList).hasSize(databaseSizeBeforeUpdate);
        GeneralForum testGeneralForum = generalForumList.get(generalForumList.size() - 1);
        assertThat(testGeneralForum.getiDGeneralForum()).isEqualTo(DEFAULT_I_D_GENERAL_FORUM);
        assertThat(testGeneralForum.getPostDate()).isEqualTo(DEFAULT_POST_DATE);
        assertThat(testGeneralForum.getPost()).isEqualTo(DEFAULT_POST);
    }

    @Test
    @Transactional
    void fullUpdateGeneralForumWithPatch() throws Exception {
        // Initialize the database
        generalForumRepository.saveAndFlush(generalForum);

        int databaseSizeBeforeUpdate = generalForumRepository.findAll().size();

        // Update the generalForum using partial update
        GeneralForum partialUpdatedGeneralForum = new GeneralForum();
        partialUpdatedGeneralForum.setId(generalForum.getId());

        partialUpdatedGeneralForum.iDGeneralForum(UPDATED_I_D_GENERAL_FORUM).postDate(UPDATED_POST_DATE).post(UPDATED_POST);

        restGeneralForumMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGeneralForum.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGeneralForum))
            )
            .andExpect(status().isOk());

        // Validate the GeneralForum in the database
        List<GeneralForum> generalForumList = generalForumRepository.findAll();
        assertThat(generalForumList).hasSize(databaseSizeBeforeUpdate);
        GeneralForum testGeneralForum = generalForumList.get(generalForumList.size() - 1);
        assertThat(testGeneralForum.getiDGeneralForum()).isEqualTo(UPDATED_I_D_GENERAL_FORUM);
        assertThat(testGeneralForum.getPostDate()).isEqualTo(UPDATED_POST_DATE);
        assertThat(testGeneralForum.getPost()).isEqualTo(UPDATED_POST);
    }

    @Test
    @Transactional
    void patchNonExistingGeneralForum() throws Exception {
        int databaseSizeBeforeUpdate = generalForumRepository.findAll().size();
        generalForum.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGeneralForumMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, generalForum.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(generalForum))
            )
            .andExpect(status().isBadRequest());

        // Validate the GeneralForum in the database
        List<GeneralForum> generalForumList = generalForumRepository.findAll();
        assertThat(generalForumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGeneralForum() throws Exception {
        int databaseSizeBeforeUpdate = generalForumRepository.findAll().size();
        generalForum.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGeneralForumMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(generalForum))
            )
            .andExpect(status().isBadRequest());

        // Validate the GeneralForum in the database
        List<GeneralForum> generalForumList = generalForumRepository.findAll();
        assertThat(generalForumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGeneralForum() throws Exception {
        int databaseSizeBeforeUpdate = generalForumRepository.findAll().size();
        generalForum.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGeneralForumMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(generalForum))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GeneralForum in the database
        List<GeneralForum> generalForumList = generalForumRepository.findAll();
        assertThat(generalForumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGeneralForum() throws Exception {
        // Initialize the database
        generalForumRepository.saveAndFlush(generalForum);

        int databaseSizeBeforeDelete = generalForumRepository.findAll().size();

        // Delete the generalForum
        restGeneralForumMockMvc
            .perform(delete(ENTITY_API_URL_ID, generalForum.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GeneralForum> generalForumList = generalForumRepository.findAll();
        assertThat(generalForumList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

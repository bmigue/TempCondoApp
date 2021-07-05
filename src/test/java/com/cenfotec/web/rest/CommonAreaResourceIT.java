package com.cenfotec.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.IntegrationTest;
import com.cenfotec.domain.CommonArea;
import com.cenfotec.repository.CommonAreaRepository;
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
 * Integration tests for the {@link CommonAreaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CommonAreaResourceIT {

    private static final Integer DEFAULT_I_D_COMMON_AREA = 1;
    private static final Integer UPDATED_I_D_COMMON_AREA = 2;

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/common-areas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CommonAreaRepository commonAreaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCommonAreaMockMvc;

    private CommonArea commonArea;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CommonArea createEntity(EntityManager em) {
        CommonArea commonArea = new CommonArea().iDCommonArea(DEFAULT_I_D_COMMON_AREA).status(DEFAULT_STATUS).name(DEFAULT_NAME);
        return commonArea;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CommonArea createUpdatedEntity(EntityManager em) {
        CommonArea commonArea = new CommonArea().iDCommonArea(UPDATED_I_D_COMMON_AREA).status(UPDATED_STATUS).name(UPDATED_NAME);
        return commonArea;
    }

    @BeforeEach
    public void initTest() {
        commonArea = createEntity(em);
    }

    @Test
    @Transactional
    void createCommonArea() throws Exception {
        int databaseSizeBeforeCreate = commonAreaRepository.findAll().size();
        // Create the CommonArea
        restCommonAreaMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commonArea))
            )
            .andExpect(status().isCreated());

        // Validate the CommonArea in the database
        List<CommonArea> commonAreaList = commonAreaRepository.findAll();
        assertThat(commonAreaList).hasSize(databaseSizeBeforeCreate + 1);
        CommonArea testCommonArea = commonAreaList.get(commonAreaList.size() - 1);
        assertThat(testCommonArea.getiDCommonArea()).isEqualTo(DEFAULT_I_D_COMMON_AREA);
        assertThat(testCommonArea.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testCommonArea.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createCommonAreaWithExistingId() throws Exception {
        // Create the CommonArea with an existing ID
        commonArea.setId(1L);

        int databaseSizeBeforeCreate = commonAreaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCommonAreaMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commonArea))
            )
            .andExpect(status().isBadRequest());

        // Validate the CommonArea in the database
        List<CommonArea> commonAreaList = commonAreaRepository.findAll();
        assertThat(commonAreaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkiDCommonAreaIsRequired() throws Exception {
        int databaseSizeBeforeTest = commonAreaRepository.findAll().size();
        // set the field null
        commonArea.setiDCommonArea(null);

        // Create the CommonArea, which fails.

        restCommonAreaMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commonArea))
            )
            .andExpect(status().isBadRequest());

        List<CommonArea> commonAreaList = commonAreaRepository.findAll();
        assertThat(commonAreaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCommonAreas() throws Exception {
        // Initialize the database
        commonAreaRepository.saveAndFlush(commonArea);

        // Get all the commonAreaList
        restCommonAreaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(commonArea.getId().intValue())))
            .andExpect(jsonPath("$.[*].iDCommonArea").value(hasItem(DEFAULT_I_D_COMMON_AREA)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getCommonArea() throws Exception {
        // Initialize the database
        commonAreaRepository.saveAndFlush(commonArea);

        // Get the commonArea
        restCommonAreaMockMvc
            .perform(get(ENTITY_API_URL_ID, commonArea.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(commonArea.getId().intValue()))
            .andExpect(jsonPath("$.iDCommonArea").value(DEFAULT_I_D_COMMON_AREA))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingCommonArea() throws Exception {
        // Get the commonArea
        restCommonAreaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCommonArea() throws Exception {
        // Initialize the database
        commonAreaRepository.saveAndFlush(commonArea);

        int databaseSizeBeforeUpdate = commonAreaRepository.findAll().size();

        // Update the commonArea
        CommonArea updatedCommonArea = commonAreaRepository.findById(commonArea.getId()).get();
        // Disconnect from session so that the updates on updatedCommonArea are not directly saved in db
        em.detach(updatedCommonArea);
        updatedCommonArea.iDCommonArea(UPDATED_I_D_COMMON_AREA).status(UPDATED_STATUS).name(UPDATED_NAME);

        restCommonAreaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCommonArea.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCommonArea))
            )
            .andExpect(status().isOk());

        // Validate the CommonArea in the database
        List<CommonArea> commonAreaList = commonAreaRepository.findAll();
        assertThat(commonAreaList).hasSize(databaseSizeBeforeUpdate);
        CommonArea testCommonArea = commonAreaList.get(commonAreaList.size() - 1);
        assertThat(testCommonArea.getiDCommonArea()).isEqualTo(UPDATED_I_D_COMMON_AREA);
        assertThat(testCommonArea.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testCommonArea.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingCommonArea() throws Exception {
        int databaseSizeBeforeUpdate = commonAreaRepository.findAll().size();
        commonArea.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommonAreaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, commonArea.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commonArea))
            )
            .andExpect(status().isBadRequest());

        // Validate the CommonArea in the database
        List<CommonArea> commonAreaList = commonAreaRepository.findAll();
        assertThat(commonAreaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCommonArea() throws Exception {
        int databaseSizeBeforeUpdate = commonAreaRepository.findAll().size();
        commonArea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommonAreaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commonArea))
            )
            .andExpect(status().isBadRequest());

        // Validate the CommonArea in the database
        List<CommonArea> commonAreaList = commonAreaRepository.findAll();
        assertThat(commonAreaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCommonArea() throws Exception {
        int databaseSizeBeforeUpdate = commonAreaRepository.findAll().size();
        commonArea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommonAreaMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commonArea))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CommonArea in the database
        List<CommonArea> commonAreaList = commonAreaRepository.findAll();
        assertThat(commonAreaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCommonAreaWithPatch() throws Exception {
        // Initialize the database
        commonAreaRepository.saveAndFlush(commonArea);

        int databaseSizeBeforeUpdate = commonAreaRepository.findAll().size();

        // Update the commonArea using partial update
        CommonArea partialUpdatedCommonArea = new CommonArea();
        partialUpdatedCommonArea.setId(commonArea.getId());

        partialUpdatedCommonArea.status(UPDATED_STATUS);

        restCommonAreaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCommonArea.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCommonArea))
            )
            .andExpect(status().isOk());

        // Validate the CommonArea in the database
        List<CommonArea> commonAreaList = commonAreaRepository.findAll();
        assertThat(commonAreaList).hasSize(databaseSizeBeforeUpdate);
        CommonArea testCommonArea = commonAreaList.get(commonAreaList.size() - 1);
        assertThat(testCommonArea.getiDCommonArea()).isEqualTo(DEFAULT_I_D_COMMON_AREA);
        assertThat(testCommonArea.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testCommonArea.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateCommonAreaWithPatch() throws Exception {
        // Initialize the database
        commonAreaRepository.saveAndFlush(commonArea);

        int databaseSizeBeforeUpdate = commonAreaRepository.findAll().size();

        // Update the commonArea using partial update
        CommonArea partialUpdatedCommonArea = new CommonArea();
        partialUpdatedCommonArea.setId(commonArea.getId());

        partialUpdatedCommonArea.iDCommonArea(UPDATED_I_D_COMMON_AREA).status(UPDATED_STATUS).name(UPDATED_NAME);

        restCommonAreaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCommonArea.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCommonArea))
            )
            .andExpect(status().isOk());

        // Validate the CommonArea in the database
        List<CommonArea> commonAreaList = commonAreaRepository.findAll();
        assertThat(commonAreaList).hasSize(databaseSizeBeforeUpdate);
        CommonArea testCommonArea = commonAreaList.get(commonAreaList.size() - 1);
        assertThat(testCommonArea.getiDCommonArea()).isEqualTo(UPDATED_I_D_COMMON_AREA);
        assertThat(testCommonArea.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testCommonArea.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingCommonArea() throws Exception {
        int databaseSizeBeforeUpdate = commonAreaRepository.findAll().size();
        commonArea.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommonAreaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, commonArea.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(commonArea))
            )
            .andExpect(status().isBadRequest());

        // Validate the CommonArea in the database
        List<CommonArea> commonAreaList = commonAreaRepository.findAll();
        assertThat(commonAreaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCommonArea() throws Exception {
        int databaseSizeBeforeUpdate = commonAreaRepository.findAll().size();
        commonArea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommonAreaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(commonArea))
            )
            .andExpect(status().isBadRequest());

        // Validate the CommonArea in the database
        List<CommonArea> commonAreaList = commonAreaRepository.findAll();
        assertThat(commonAreaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCommonArea() throws Exception {
        int databaseSizeBeforeUpdate = commonAreaRepository.findAll().size();
        commonArea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommonAreaMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(commonArea))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CommonArea in the database
        List<CommonArea> commonAreaList = commonAreaRepository.findAll();
        assertThat(commonAreaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCommonArea() throws Exception {
        // Initialize the database
        commonAreaRepository.saveAndFlush(commonArea);

        int databaseSizeBeforeDelete = commonAreaRepository.findAll().size();

        // Delete the commonArea
        restCommonAreaMockMvc
            .perform(delete(ENTITY_API_URL_ID, commonArea.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CommonArea> commonAreaList = commonAreaRepository.findAll();
        assertThat(commonAreaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

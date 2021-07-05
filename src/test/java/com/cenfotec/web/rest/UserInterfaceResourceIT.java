package com.cenfotec.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.IntegrationTest;
import com.cenfotec.domain.UserInterface;
import com.cenfotec.repository.UserInterfaceRepository;
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
 * Integration tests for the {@link UserInterfaceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserInterfaceResourceIT {

    private static final Integer DEFAULT_I_D_USER_INTERFACE = 1;
    private static final Integer UPDATED_I_D_USER_INTERFACE = 2;

    private static final String DEFAULT_THEME_NAME = "AAAAAAAAAA";
    private static final String UPDATED_THEME_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_COLOR = "AAAAAAAAAA";
    private static final String UPDATED_COLOR = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/user-interfaces";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserInterfaceRepository userInterfaceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserInterfaceMockMvc;

    private UserInterface userInterface;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserInterface createEntity(EntityManager em) {
        UserInterface userInterface = new UserInterface()
            .iDUserInterface(DEFAULT_I_D_USER_INTERFACE)
            .themeName(DEFAULT_THEME_NAME)
            .color(DEFAULT_COLOR);
        return userInterface;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserInterface createUpdatedEntity(EntityManager em) {
        UserInterface userInterface = new UserInterface()
            .iDUserInterface(UPDATED_I_D_USER_INTERFACE)
            .themeName(UPDATED_THEME_NAME)
            .color(UPDATED_COLOR);
        return userInterface;
    }

    @BeforeEach
    public void initTest() {
        userInterface = createEntity(em);
    }

    @Test
    @Transactional
    void createUserInterface() throws Exception {
        int databaseSizeBeforeCreate = userInterfaceRepository.findAll().size();
        // Create the UserInterface
        restUserInterfaceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userInterface))
            )
            .andExpect(status().isCreated());

        // Validate the UserInterface in the database
        List<UserInterface> userInterfaceList = userInterfaceRepository.findAll();
        assertThat(userInterfaceList).hasSize(databaseSizeBeforeCreate + 1);
        UserInterface testUserInterface = userInterfaceList.get(userInterfaceList.size() - 1);
        assertThat(testUserInterface.getiDUserInterface()).isEqualTo(DEFAULT_I_D_USER_INTERFACE);
        assertThat(testUserInterface.getThemeName()).isEqualTo(DEFAULT_THEME_NAME);
        assertThat(testUserInterface.getColor()).isEqualTo(DEFAULT_COLOR);
    }

    @Test
    @Transactional
    void createUserInterfaceWithExistingId() throws Exception {
        // Create the UserInterface with an existing ID
        userInterface.setId(1L);

        int databaseSizeBeforeCreate = userInterfaceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserInterfaceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userInterface))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserInterface in the database
        List<UserInterface> userInterfaceList = userInterfaceRepository.findAll();
        assertThat(userInterfaceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkiDUserInterfaceIsRequired() throws Exception {
        int databaseSizeBeforeTest = userInterfaceRepository.findAll().size();
        // set the field null
        userInterface.setiDUserInterface(null);

        // Create the UserInterface, which fails.

        restUserInterfaceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userInterface))
            )
            .andExpect(status().isBadRequest());

        List<UserInterface> userInterfaceList = userInterfaceRepository.findAll();
        assertThat(userInterfaceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUserInterfaces() throws Exception {
        // Initialize the database
        userInterfaceRepository.saveAndFlush(userInterface);

        // Get all the userInterfaceList
        restUserInterfaceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userInterface.getId().intValue())))
            .andExpect(jsonPath("$.[*].iDUserInterface").value(hasItem(DEFAULT_I_D_USER_INTERFACE)))
            .andExpect(jsonPath("$.[*].themeName").value(hasItem(DEFAULT_THEME_NAME)))
            .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR)));
    }

    @Test
    @Transactional
    void getUserInterface() throws Exception {
        // Initialize the database
        userInterfaceRepository.saveAndFlush(userInterface);

        // Get the userInterface
        restUserInterfaceMockMvc
            .perform(get(ENTITY_API_URL_ID, userInterface.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userInterface.getId().intValue()))
            .andExpect(jsonPath("$.iDUserInterface").value(DEFAULT_I_D_USER_INTERFACE))
            .andExpect(jsonPath("$.themeName").value(DEFAULT_THEME_NAME))
            .andExpect(jsonPath("$.color").value(DEFAULT_COLOR));
    }

    @Test
    @Transactional
    void getNonExistingUserInterface() throws Exception {
        // Get the userInterface
        restUserInterfaceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUserInterface() throws Exception {
        // Initialize the database
        userInterfaceRepository.saveAndFlush(userInterface);

        int databaseSizeBeforeUpdate = userInterfaceRepository.findAll().size();

        // Update the userInterface
        UserInterface updatedUserInterface = userInterfaceRepository.findById(userInterface.getId()).get();
        // Disconnect from session so that the updates on updatedUserInterface are not directly saved in db
        em.detach(updatedUserInterface);
        updatedUserInterface.iDUserInterface(UPDATED_I_D_USER_INTERFACE).themeName(UPDATED_THEME_NAME).color(UPDATED_COLOR);

        restUserInterfaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserInterface.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserInterface))
            )
            .andExpect(status().isOk());

        // Validate the UserInterface in the database
        List<UserInterface> userInterfaceList = userInterfaceRepository.findAll();
        assertThat(userInterfaceList).hasSize(databaseSizeBeforeUpdate);
        UserInterface testUserInterface = userInterfaceList.get(userInterfaceList.size() - 1);
        assertThat(testUserInterface.getiDUserInterface()).isEqualTo(UPDATED_I_D_USER_INTERFACE);
        assertThat(testUserInterface.getThemeName()).isEqualTo(UPDATED_THEME_NAME);
        assertThat(testUserInterface.getColor()).isEqualTo(UPDATED_COLOR);
    }

    @Test
    @Transactional
    void putNonExistingUserInterface() throws Exception {
        int databaseSizeBeforeUpdate = userInterfaceRepository.findAll().size();
        userInterface.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserInterfaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userInterface.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userInterface))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserInterface in the database
        List<UserInterface> userInterfaceList = userInterfaceRepository.findAll();
        assertThat(userInterfaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserInterface() throws Exception {
        int databaseSizeBeforeUpdate = userInterfaceRepository.findAll().size();
        userInterface.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserInterfaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userInterface))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserInterface in the database
        List<UserInterface> userInterfaceList = userInterfaceRepository.findAll();
        assertThat(userInterfaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserInterface() throws Exception {
        int databaseSizeBeforeUpdate = userInterfaceRepository.findAll().size();
        userInterface.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserInterfaceMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userInterface))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserInterface in the database
        List<UserInterface> userInterfaceList = userInterfaceRepository.findAll();
        assertThat(userInterfaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserInterfaceWithPatch() throws Exception {
        // Initialize the database
        userInterfaceRepository.saveAndFlush(userInterface);

        int databaseSizeBeforeUpdate = userInterfaceRepository.findAll().size();

        // Update the userInterface using partial update
        UserInterface partialUpdatedUserInterface = new UserInterface();
        partialUpdatedUserInterface.setId(userInterface.getId());

        partialUpdatedUserInterface.themeName(UPDATED_THEME_NAME).color(UPDATED_COLOR);

        restUserInterfaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserInterface.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserInterface))
            )
            .andExpect(status().isOk());

        // Validate the UserInterface in the database
        List<UserInterface> userInterfaceList = userInterfaceRepository.findAll();
        assertThat(userInterfaceList).hasSize(databaseSizeBeforeUpdate);
        UserInterface testUserInterface = userInterfaceList.get(userInterfaceList.size() - 1);
        assertThat(testUserInterface.getiDUserInterface()).isEqualTo(DEFAULT_I_D_USER_INTERFACE);
        assertThat(testUserInterface.getThemeName()).isEqualTo(UPDATED_THEME_NAME);
        assertThat(testUserInterface.getColor()).isEqualTo(UPDATED_COLOR);
    }

    @Test
    @Transactional
    void fullUpdateUserInterfaceWithPatch() throws Exception {
        // Initialize the database
        userInterfaceRepository.saveAndFlush(userInterface);

        int databaseSizeBeforeUpdate = userInterfaceRepository.findAll().size();

        // Update the userInterface using partial update
        UserInterface partialUpdatedUserInterface = new UserInterface();
        partialUpdatedUserInterface.setId(userInterface.getId());

        partialUpdatedUserInterface.iDUserInterface(UPDATED_I_D_USER_INTERFACE).themeName(UPDATED_THEME_NAME).color(UPDATED_COLOR);

        restUserInterfaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserInterface.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserInterface))
            )
            .andExpect(status().isOk());

        // Validate the UserInterface in the database
        List<UserInterface> userInterfaceList = userInterfaceRepository.findAll();
        assertThat(userInterfaceList).hasSize(databaseSizeBeforeUpdate);
        UserInterface testUserInterface = userInterfaceList.get(userInterfaceList.size() - 1);
        assertThat(testUserInterface.getiDUserInterface()).isEqualTo(UPDATED_I_D_USER_INTERFACE);
        assertThat(testUserInterface.getThemeName()).isEqualTo(UPDATED_THEME_NAME);
        assertThat(testUserInterface.getColor()).isEqualTo(UPDATED_COLOR);
    }

    @Test
    @Transactional
    void patchNonExistingUserInterface() throws Exception {
        int databaseSizeBeforeUpdate = userInterfaceRepository.findAll().size();
        userInterface.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserInterfaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userInterface.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userInterface))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserInterface in the database
        List<UserInterface> userInterfaceList = userInterfaceRepository.findAll();
        assertThat(userInterfaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserInterface() throws Exception {
        int databaseSizeBeforeUpdate = userInterfaceRepository.findAll().size();
        userInterface.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserInterfaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userInterface))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserInterface in the database
        List<UserInterface> userInterfaceList = userInterfaceRepository.findAll();
        assertThat(userInterfaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserInterface() throws Exception {
        int databaseSizeBeforeUpdate = userInterfaceRepository.findAll().size();
        userInterface.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserInterfaceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userInterface))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserInterface in the database
        List<UserInterface> userInterfaceList = userInterfaceRepository.findAll();
        assertThat(userInterfaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserInterface() throws Exception {
        // Initialize the database
        userInterfaceRepository.saveAndFlush(userInterface);

        int databaseSizeBeforeDelete = userInterfaceRepository.findAll().size();

        // Delete the userInterface
        restUserInterfaceMockMvc
            .perform(delete(ENTITY_API_URL_ID, userInterface.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserInterface> userInterfaceList = userInterfaceRepository.findAll();
        assertThat(userInterfaceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

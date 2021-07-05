package com.cenfotec.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.IntegrationTest;
import com.cenfotec.domain.Guest;
import com.cenfotec.repository.GuestRepository;
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
 * Integration tests for the {@link GuestResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GuestResourceIT {

    private static final Integer DEFAULT_I_D_GUEST = 1;
    private static final Integer UPDATED_I_D_GUEST = 2;

    private static final String DEFAULT_FULL_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FULL_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PLATE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PLATE_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/guests";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGuestMockMvc;

    private Guest guest;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Guest createEntity(EntityManager em) {
        Guest guest = new Guest()
            .iDGuest(DEFAULT_I_D_GUEST)
            .fullName(DEFAULT_FULL_NAME)
            .plateNumber(DEFAULT_PLATE_NUMBER)
            .status(DEFAULT_STATUS);
        return guest;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Guest createUpdatedEntity(EntityManager em) {
        Guest guest = new Guest()
            .iDGuest(UPDATED_I_D_GUEST)
            .fullName(UPDATED_FULL_NAME)
            .plateNumber(UPDATED_PLATE_NUMBER)
            .status(UPDATED_STATUS);
        return guest;
    }

    @BeforeEach
    public void initTest() {
        guest = createEntity(em);
    }

    @Test
    @Transactional
    void createGuest() throws Exception {
        int databaseSizeBeforeCreate = guestRepository.findAll().size();
        // Create the Guest
        restGuestMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(guest))
            )
            .andExpect(status().isCreated());

        // Validate the Guest in the database
        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeCreate + 1);
        Guest testGuest = guestList.get(guestList.size() - 1);
        assertThat(testGuest.getiDGuest()).isEqualTo(DEFAULT_I_D_GUEST);
        assertThat(testGuest.getFullName()).isEqualTo(DEFAULT_FULL_NAME);
        assertThat(testGuest.getPlateNumber()).isEqualTo(DEFAULT_PLATE_NUMBER);
        assertThat(testGuest.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createGuestWithExistingId() throws Exception {
        // Create the Guest with an existing ID
        guest.setId(1L);

        int databaseSizeBeforeCreate = guestRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGuestMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(guest))
            )
            .andExpect(status().isBadRequest());

        // Validate the Guest in the database
        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkiDGuestIsRequired() throws Exception {
        int databaseSizeBeforeTest = guestRepository.findAll().size();
        // set the field null
        guest.setiDGuest(null);

        // Create the Guest, which fails.

        restGuestMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(guest))
            )
            .andExpect(status().isBadRequest());

        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGuests() throws Exception {
        // Initialize the database
        guestRepository.saveAndFlush(guest);

        // Get all the guestList
        restGuestMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(guest.getId().intValue())))
            .andExpect(jsonPath("$.[*].iDGuest").value(hasItem(DEFAULT_I_D_GUEST)))
            .andExpect(jsonPath("$.[*].fullName").value(hasItem(DEFAULT_FULL_NAME)))
            .andExpect(jsonPath("$.[*].plateNumber").value(hasItem(DEFAULT_PLATE_NUMBER)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @Test
    @Transactional
    void getGuest() throws Exception {
        // Initialize the database
        guestRepository.saveAndFlush(guest);

        // Get the guest
        restGuestMockMvc
            .perform(get(ENTITY_API_URL_ID, guest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(guest.getId().intValue()))
            .andExpect(jsonPath("$.iDGuest").value(DEFAULT_I_D_GUEST))
            .andExpect(jsonPath("$.fullName").value(DEFAULT_FULL_NAME))
            .andExpect(jsonPath("$.plateNumber").value(DEFAULT_PLATE_NUMBER))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingGuest() throws Exception {
        // Get the guest
        restGuestMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewGuest() throws Exception {
        // Initialize the database
        guestRepository.saveAndFlush(guest);

        int databaseSizeBeforeUpdate = guestRepository.findAll().size();

        // Update the guest
        Guest updatedGuest = guestRepository.findById(guest.getId()).get();
        // Disconnect from session so that the updates on updatedGuest are not directly saved in db
        em.detach(updatedGuest);
        updatedGuest.iDGuest(UPDATED_I_D_GUEST).fullName(UPDATED_FULL_NAME).plateNumber(UPDATED_PLATE_NUMBER).status(UPDATED_STATUS);

        restGuestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGuest.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGuest))
            )
            .andExpect(status().isOk());

        // Validate the Guest in the database
        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeUpdate);
        Guest testGuest = guestList.get(guestList.size() - 1);
        assertThat(testGuest.getiDGuest()).isEqualTo(UPDATED_I_D_GUEST);
        assertThat(testGuest.getFullName()).isEqualTo(UPDATED_FULL_NAME);
        assertThat(testGuest.getPlateNumber()).isEqualTo(UPDATED_PLATE_NUMBER);
        assertThat(testGuest.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingGuest() throws Exception {
        int databaseSizeBeforeUpdate = guestRepository.findAll().size();
        guest.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGuestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, guest.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(guest))
            )
            .andExpect(status().isBadRequest());

        // Validate the Guest in the database
        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGuest() throws Exception {
        int databaseSizeBeforeUpdate = guestRepository.findAll().size();
        guest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGuestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(guest))
            )
            .andExpect(status().isBadRequest());

        // Validate the Guest in the database
        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGuest() throws Exception {
        int databaseSizeBeforeUpdate = guestRepository.findAll().size();
        guest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGuestMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(guest))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Guest in the database
        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGuestWithPatch() throws Exception {
        // Initialize the database
        guestRepository.saveAndFlush(guest);

        int databaseSizeBeforeUpdate = guestRepository.findAll().size();

        // Update the guest using partial update
        Guest partialUpdatedGuest = new Guest();
        partialUpdatedGuest.setId(guest.getId());

        partialUpdatedGuest.iDGuest(UPDATED_I_D_GUEST).fullName(UPDATED_FULL_NAME);

        restGuestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGuest.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGuest))
            )
            .andExpect(status().isOk());

        // Validate the Guest in the database
        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeUpdate);
        Guest testGuest = guestList.get(guestList.size() - 1);
        assertThat(testGuest.getiDGuest()).isEqualTo(UPDATED_I_D_GUEST);
        assertThat(testGuest.getFullName()).isEqualTo(UPDATED_FULL_NAME);
        assertThat(testGuest.getPlateNumber()).isEqualTo(DEFAULT_PLATE_NUMBER);
        assertThat(testGuest.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateGuestWithPatch() throws Exception {
        // Initialize the database
        guestRepository.saveAndFlush(guest);

        int databaseSizeBeforeUpdate = guestRepository.findAll().size();

        // Update the guest using partial update
        Guest partialUpdatedGuest = new Guest();
        partialUpdatedGuest.setId(guest.getId());

        partialUpdatedGuest.iDGuest(UPDATED_I_D_GUEST).fullName(UPDATED_FULL_NAME).plateNumber(UPDATED_PLATE_NUMBER).status(UPDATED_STATUS);

        restGuestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGuest.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGuest))
            )
            .andExpect(status().isOk());

        // Validate the Guest in the database
        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeUpdate);
        Guest testGuest = guestList.get(guestList.size() - 1);
        assertThat(testGuest.getiDGuest()).isEqualTo(UPDATED_I_D_GUEST);
        assertThat(testGuest.getFullName()).isEqualTo(UPDATED_FULL_NAME);
        assertThat(testGuest.getPlateNumber()).isEqualTo(UPDATED_PLATE_NUMBER);
        assertThat(testGuest.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingGuest() throws Exception {
        int databaseSizeBeforeUpdate = guestRepository.findAll().size();
        guest.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGuestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, guest.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(guest))
            )
            .andExpect(status().isBadRequest());

        // Validate the Guest in the database
        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGuest() throws Exception {
        int databaseSizeBeforeUpdate = guestRepository.findAll().size();
        guest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGuestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(guest))
            )
            .andExpect(status().isBadRequest());

        // Validate the Guest in the database
        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGuest() throws Exception {
        int databaseSizeBeforeUpdate = guestRepository.findAll().size();
        guest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGuestMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(guest))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Guest in the database
        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGuest() throws Exception {
        // Initialize the database
        guestRepository.saveAndFlush(guest);

        int databaseSizeBeforeDelete = guestRepository.findAll().size();

        // Delete the guest
        restGuestMockMvc
            .perform(delete(ENTITY_API_URL_ID, guest.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

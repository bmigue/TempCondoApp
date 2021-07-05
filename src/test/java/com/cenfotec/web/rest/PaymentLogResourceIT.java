package com.cenfotec.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.IntegrationTest;
import com.cenfotec.domain.PaymentLog;
import com.cenfotec.repository.PaymentLogRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link PaymentLogResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PaymentLogResourceIT {

    private static final Integer DEFAULT_I_D_PAYMENT_LOG = 1;
    private static final Integer UPDATED_I_D_PAYMENT_LOG = 2;

    private static final LocalDate DEFAULT_DUE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DUE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/payment-logs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PaymentLogRepository paymentLogRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPaymentLogMockMvc;

    private PaymentLog paymentLog;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PaymentLog createEntity(EntityManager em) {
        PaymentLog paymentLog = new PaymentLog().iDPaymentLog(DEFAULT_I_D_PAYMENT_LOG).dueDate(DEFAULT_DUE_DATE).status(DEFAULT_STATUS);
        return paymentLog;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PaymentLog createUpdatedEntity(EntityManager em) {
        PaymentLog paymentLog = new PaymentLog().iDPaymentLog(UPDATED_I_D_PAYMENT_LOG).dueDate(UPDATED_DUE_DATE).status(UPDATED_STATUS);
        return paymentLog;
    }

    @BeforeEach
    public void initTest() {
        paymentLog = createEntity(em);
    }

    @Test
    @Transactional
    void createPaymentLog() throws Exception {
        int databaseSizeBeforeCreate = paymentLogRepository.findAll().size();
        // Create the PaymentLog
        restPaymentLogMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(paymentLog))
            )
            .andExpect(status().isCreated());

        // Validate the PaymentLog in the database
        List<PaymentLog> paymentLogList = paymentLogRepository.findAll();
        assertThat(paymentLogList).hasSize(databaseSizeBeforeCreate + 1);
        PaymentLog testPaymentLog = paymentLogList.get(paymentLogList.size() - 1);
        assertThat(testPaymentLog.getiDPaymentLog()).isEqualTo(DEFAULT_I_D_PAYMENT_LOG);
        assertThat(testPaymentLog.getDueDate()).isEqualTo(DEFAULT_DUE_DATE);
        assertThat(testPaymentLog.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createPaymentLogWithExistingId() throws Exception {
        // Create the PaymentLog with an existing ID
        paymentLog.setId(1L);

        int databaseSizeBeforeCreate = paymentLogRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPaymentLogMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(paymentLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the PaymentLog in the database
        List<PaymentLog> paymentLogList = paymentLogRepository.findAll();
        assertThat(paymentLogList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkiDPaymentLogIsRequired() throws Exception {
        int databaseSizeBeforeTest = paymentLogRepository.findAll().size();
        // set the field null
        paymentLog.setiDPaymentLog(null);

        // Create the PaymentLog, which fails.

        restPaymentLogMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(paymentLog))
            )
            .andExpect(status().isBadRequest());

        List<PaymentLog> paymentLogList = paymentLogRepository.findAll();
        assertThat(paymentLogList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPaymentLogs() throws Exception {
        // Initialize the database
        paymentLogRepository.saveAndFlush(paymentLog);

        // Get all the paymentLogList
        restPaymentLogMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paymentLog.getId().intValue())))
            .andExpect(jsonPath("$.[*].iDPaymentLog").value(hasItem(DEFAULT_I_D_PAYMENT_LOG)))
            .andExpect(jsonPath("$.[*].dueDate").value(hasItem(DEFAULT_DUE_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @Test
    @Transactional
    void getPaymentLog() throws Exception {
        // Initialize the database
        paymentLogRepository.saveAndFlush(paymentLog);

        // Get the paymentLog
        restPaymentLogMockMvc
            .perform(get(ENTITY_API_URL_ID, paymentLog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(paymentLog.getId().intValue()))
            .andExpect(jsonPath("$.iDPaymentLog").value(DEFAULT_I_D_PAYMENT_LOG))
            .andExpect(jsonPath("$.dueDate").value(DEFAULT_DUE_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingPaymentLog() throws Exception {
        // Get the paymentLog
        restPaymentLogMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPaymentLog() throws Exception {
        // Initialize the database
        paymentLogRepository.saveAndFlush(paymentLog);

        int databaseSizeBeforeUpdate = paymentLogRepository.findAll().size();

        // Update the paymentLog
        PaymentLog updatedPaymentLog = paymentLogRepository.findById(paymentLog.getId()).get();
        // Disconnect from session so that the updates on updatedPaymentLog are not directly saved in db
        em.detach(updatedPaymentLog);
        updatedPaymentLog.iDPaymentLog(UPDATED_I_D_PAYMENT_LOG).dueDate(UPDATED_DUE_DATE).status(UPDATED_STATUS);

        restPaymentLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPaymentLog.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPaymentLog))
            )
            .andExpect(status().isOk());

        // Validate the PaymentLog in the database
        List<PaymentLog> paymentLogList = paymentLogRepository.findAll();
        assertThat(paymentLogList).hasSize(databaseSizeBeforeUpdate);
        PaymentLog testPaymentLog = paymentLogList.get(paymentLogList.size() - 1);
        assertThat(testPaymentLog.getiDPaymentLog()).isEqualTo(UPDATED_I_D_PAYMENT_LOG);
        assertThat(testPaymentLog.getDueDate()).isEqualTo(UPDATED_DUE_DATE);
        assertThat(testPaymentLog.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingPaymentLog() throws Exception {
        int databaseSizeBeforeUpdate = paymentLogRepository.findAll().size();
        paymentLog.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPaymentLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, paymentLog.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(paymentLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the PaymentLog in the database
        List<PaymentLog> paymentLogList = paymentLogRepository.findAll();
        assertThat(paymentLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPaymentLog() throws Exception {
        int databaseSizeBeforeUpdate = paymentLogRepository.findAll().size();
        paymentLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaymentLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(paymentLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the PaymentLog in the database
        List<PaymentLog> paymentLogList = paymentLogRepository.findAll();
        assertThat(paymentLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPaymentLog() throws Exception {
        int databaseSizeBeforeUpdate = paymentLogRepository.findAll().size();
        paymentLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaymentLogMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(paymentLog))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PaymentLog in the database
        List<PaymentLog> paymentLogList = paymentLogRepository.findAll();
        assertThat(paymentLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePaymentLogWithPatch() throws Exception {
        // Initialize the database
        paymentLogRepository.saveAndFlush(paymentLog);

        int databaseSizeBeforeUpdate = paymentLogRepository.findAll().size();

        // Update the paymentLog using partial update
        PaymentLog partialUpdatedPaymentLog = new PaymentLog();
        partialUpdatedPaymentLog.setId(paymentLog.getId());

        partialUpdatedPaymentLog.dueDate(UPDATED_DUE_DATE);

        restPaymentLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPaymentLog.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPaymentLog))
            )
            .andExpect(status().isOk());

        // Validate the PaymentLog in the database
        List<PaymentLog> paymentLogList = paymentLogRepository.findAll();
        assertThat(paymentLogList).hasSize(databaseSizeBeforeUpdate);
        PaymentLog testPaymentLog = paymentLogList.get(paymentLogList.size() - 1);
        assertThat(testPaymentLog.getiDPaymentLog()).isEqualTo(DEFAULT_I_D_PAYMENT_LOG);
        assertThat(testPaymentLog.getDueDate()).isEqualTo(UPDATED_DUE_DATE);
        assertThat(testPaymentLog.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void fullUpdatePaymentLogWithPatch() throws Exception {
        // Initialize the database
        paymentLogRepository.saveAndFlush(paymentLog);

        int databaseSizeBeforeUpdate = paymentLogRepository.findAll().size();

        // Update the paymentLog using partial update
        PaymentLog partialUpdatedPaymentLog = new PaymentLog();
        partialUpdatedPaymentLog.setId(paymentLog.getId());

        partialUpdatedPaymentLog.iDPaymentLog(UPDATED_I_D_PAYMENT_LOG).dueDate(UPDATED_DUE_DATE).status(UPDATED_STATUS);

        restPaymentLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPaymentLog.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPaymentLog))
            )
            .andExpect(status().isOk());

        // Validate the PaymentLog in the database
        List<PaymentLog> paymentLogList = paymentLogRepository.findAll();
        assertThat(paymentLogList).hasSize(databaseSizeBeforeUpdate);
        PaymentLog testPaymentLog = paymentLogList.get(paymentLogList.size() - 1);
        assertThat(testPaymentLog.getiDPaymentLog()).isEqualTo(UPDATED_I_D_PAYMENT_LOG);
        assertThat(testPaymentLog.getDueDate()).isEqualTo(UPDATED_DUE_DATE);
        assertThat(testPaymentLog.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingPaymentLog() throws Exception {
        int databaseSizeBeforeUpdate = paymentLogRepository.findAll().size();
        paymentLog.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPaymentLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, paymentLog.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(paymentLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the PaymentLog in the database
        List<PaymentLog> paymentLogList = paymentLogRepository.findAll();
        assertThat(paymentLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPaymentLog() throws Exception {
        int databaseSizeBeforeUpdate = paymentLogRepository.findAll().size();
        paymentLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaymentLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(paymentLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the PaymentLog in the database
        List<PaymentLog> paymentLogList = paymentLogRepository.findAll();
        assertThat(paymentLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPaymentLog() throws Exception {
        int databaseSizeBeforeUpdate = paymentLogRepository.findAll().size();
        paymentLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaymentLogMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(paymentLog))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PaymentLog in the database
        List<PaymentLog> paymentLogList = paymentLogRepository.findAll();
        assertThat(paymentLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePaymentLog() throws Exception {
        // Initialize the database
        paymentLogRepository.saveAndFlush(paymentLog);

        int databaseSizeBeforeDelete = paymentLogRepository.findAll().size();

        // Delete the paymentLog
        restPaymentLogMockMvc
            .perform(delete(ENTITY_API_URL_ID, paymentLog.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PaymentLog> paymentLogList = paymentLogRepository.findAll();
        assertThat(paymentLogList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

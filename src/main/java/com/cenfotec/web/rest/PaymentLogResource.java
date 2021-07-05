package com.cenfotec.web.rest;

import com.cenfotec.domain.PaymentLog;
import com.cenfotec.repository.PaymentLogRepository;
import com.cenfotec.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.cenfotec.domain.PaymentLog}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PaymentLogResource {

    private final Logger log = LoggerFactory.getLogger(PaymentLogResource.class);

    private static final String ENTITY_NAME = "paymentLog";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PaymentLogRepository paymentLogRepository;

    public PaymentLogResource(PaymentLogRepository paymentLogRepository) {
        this.paymentLogRepository = paymentLogRepository;
    }

    /**
     * {@code POST  /payment-logs} : Create a new paymentLog.
     *
     * @param paymentLog the paymentLog to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new paymentLog, or with status {@code 400 (Bad Request)} if the paymentLog has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/payment-logs")
    public ResponseEntity<PaymentLog> createPaymentLog(@Valid @RequestBody PaymentLog paymentLog) throws URISyntaxException {
        log.debug("REST request to save PaymentLog : {}", paymentLog);
        if (paymentLog.getId() != null) {
            throw new BadRequestAlertException("A new paymentLog cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PaymentLog result = paymentLogRepository.save(paymentLog);
        return ResponseEntity
            .created(new URI("/api/payment-logs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /payment-logs/:id} : Updates an existing paymentLog.
     *
     * @param id the id of the paymentLog to save.
     * @param paymentLog the paymentLog to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated paymentLog,
     * or with status {@code 400 (Bad Request)} if the paymentLog is not valid,
     * or with status {@code 500 (Internal Server Error)} if the paymentLog couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/payment-logs/{id}")
    public ResponseEntity<PaymentLog> updatePaymentLog(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PaymentLog paymentLog
    ) throws URISyntaxException {
        log.debug("REST request to update PaymentLog : {}, {}", id, paymentLog);
        if (paymentLog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, paymentLog.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!paymentLogRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PaymentLog result = paymentLogRepository.save(paymentLog);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, paymentLog.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /payment-logs/:id} : Partial updates given fields of an existing paymentLog, field will ignore if it is null
     *
     * @param id the id of the paymentLog to save.
     * @param paymentLog the paymentLog to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated paymentLog,
     * or with status {@code 400 (Bad Request)} if the paymentLog is not valid,
     * or with status {@code 404 (Not Found)} if the paymentLog is not found,
     * or with status {@code 500 (Internal Server Error)} if the paymentLog couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/payment-logs/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<PaymentLog> partialUpdatePaymentLog(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PaymentLog paymentLog
    ) throws URISyntaxException {
        log.debug("REST request to partial update PaymentLog partially : {}, {}", id, paymentLog);
        if (paymentLog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, paymentLog.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!paymentLogRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PaymentLog> result = paymentLogRepository
            .findById(paymentLog.getId())
            .map(
                existingPaymentLog -> {
                    if (paymentLog.getiDPaymentLog() != null) {
                        existingPaymentLog.setiDPaymentLog(paymentLog.getiDPaymentLog());
                    }
                    if (paymentLog.getDueDate() != null) {
                        existingPaymentLog.setDueDate(paymentLog.getDueDate());
                    }
                    if (paymentLog.getStatus() != null) {
                        existingPaymentLog.setStatus(paymentLog.getStatus());
                    }

                    return existingPaymentLog;
                }
            )
            .map(paymentLogRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, paymentLog.getId().toString())
        );
    }

    /**
     * {@code GET  /payment-logs} : get all the paymentLogs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of paymentLogs in body.
     */
    @GetMapping("/payment-logs")
    public List<PaymentLog> getAllPaymentLogs() {
        log.debug("REST request to get all PaymentLogs");
        return paymentLogRepository.findAll();
    }

    /**
     * {@code GET  /payment-logs/:id} : get the "id" paymentLog.
     *
     * @param id the id of the paymentLog to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the paymentLog, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/payment-logs/{id}")
    public ResponseEntity<PaymentLog> getPaymentLog(@PathVariable Long id) {
        log.debug("REST request to get PaymentLog : {}", id);
        Optional<PaymentLog> paymentLog = paymentLogRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(paymentLog);
    }

    /**
     * {@code DELETE  /payment-logs/:id} : delete the "id" paymentLog.
     *
     * @param id the id of the paymentLog to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/payment-logs/{id}")
    public ResponseEntity<Void> deletePaymentLog(@PathVariable Long id) {
        log.debug("REST request to delete PaymentLog : {}", id);
        paymentLogRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

package com.cenfotec.web.rest;

import com.cenfotec.domain.CheckLog;
import com.cenfotec.repository.CheckLogRepository;
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
 * REST controller for managing {@link com.cenfotec.domain.CheckLog}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CheckLogResource {

    private final Logger log = LoggerFactory.getLogger(CheckLogResource.class);

    private static final String ENTITY_NAME = "checkLog";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CheckLogRepository checkLogRepository;

    public CheckLogResource(CheckLogRepository checkLogRepository) {
        this.checkLogRepository = checkLogRepository;
    }

    /**
     * {@code POST  /check-logs} : Create a new checkLog.
     *
     * @param checkLog the checkLog to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new checkLog, or with status {@code 400 (Bad Request)} if the checkLog has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/check-logs")
    public ResponseEntity<CheckLog> createCheckLog(@Valid @RequestBody CheckLog checkLog) throws URISyntaxException {
        log.debug("REST request to save CheckLog : {}", checkLog);
        if (checkLog.getId() != null) {
            throw new BadRequestAlertException("A new checkLog cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CheckLog result = checkLogRepository.save(checkLog);
        return ResponseEntity
            .created(new URI("/api/check-logs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /check-logs/:id} : Updates an existing checkLog.
     *
     * @param id the id of the checkLog to save.
     * @param checkLog the checkLog to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated checkLog,
     * or with status {@code 400 (Bad Request)} if the checkLog is not valid,
     * or with status {@code 500 (Internal Server Error)} if the checkLog couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/check-logs/{id}")
    public ResponseEntity<CheckLog> updateCheckLog(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CheckLog checkLog
    ) throws URISyntaxException {
        log.debug("REST request to update CheckLog : {}, {}", id, checkLog);
        if (checkLog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, checkLog.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!checkLogRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CheckLog result = checkLogRepository.save(checkLog);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, checkLog.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /check-logs/:id} : Partial updates given fields of an existing checkLog, field will ignore if it is null
     *
     * @param id the id of the checkLog to save.
     * @param checkLog the checkLog to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated checkLog,
     * or with status {@code 400 (Bad Request)} if the checkLog is not valid,
     * or with status {@code 404 (Not Found)} if the checkLog is not found,
     * or with status {@code 500 (Internal Server Error)} if the checkLog couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/check-logs/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<CheckLog> partialUpdateCheckLog(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CheckLog checkLog
    ) throws URISyntaxException {
        log.debug("REST request to partial update CheckLog partially : {}, {}", id, checkLog);
        if (checkLog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, checkLog.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!checkLogRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CheckLog> result = checkLogRepository
            .findById(checkLog.getId())
            .map(
                existingCheckLog -> {
                    if (checkLog.getiDCheckLog() != null) {
                        existingCheckLog.setiDCheckLog(checkLog.getiDCheckLog());
                    }
                    if (checkLog.getInDateTime() != null) {
                        existingCheckLog.setInDateTime(checkLog.getInDateTime());
                    }
                    if (checkLog.getOutDateTime() != null) {
                        existingCheckLog.setOutDateTime(checkLog.getOutDateTime());
                    }

                    return existingCheckLog;
                }
            )
            .map(checkLogRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, checkLog.getId().toString())
        );
    }

    /**
     * {@code GET  /check-logs} : get all the checkLogs.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of checkLogs in body.
     */
    @GetMapping("/check-logs")
    public List<CheckLog> getAllCheckLogs(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all CheckLogs");
        return checkLogRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /check-logs/:id} : get the "id" checkLog.
     *
     * @param id the id of the checkLog to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the checkLog, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/check-logs/{id}")
    public ResponseEntity<CheckLog> getCheckLog(@PathVariable Long id) {
        log.debug("REST request to get CheckLog : {}", id);
        Optional<CheckLog> checkLog = checkLogRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(checkLog);
    }

    /**
     * {@code DELETE  /check-logs/:id} : delete the "id" checkLog.
     *
     * @param id the id of the checkLog to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/check-logs/{id}")
    public ResponseEntity<Void> deleteCheckLog(@PathVariable Long id) {
        log.debug("REST request to delete CheckLog : {}", id);
        checkLogRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

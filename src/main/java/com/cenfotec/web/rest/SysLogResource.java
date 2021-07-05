package com.cenfotec.web.rest;

import com.cenfotec.domain.SysLog;
import com.cenfotec.repository.SysLogRepository;
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
 * REST controller for managing {@link com.cenfotec.domain.SysLog}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SysLogResource {

    private final Logger log = LoggerFactory.getLogger(SysLogResource.class);

    private static final String ENTITY_NAME = "sysLog";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SysLogRepository sysLogRepository;

    public SysLogResource(SysLogRepository sysLogRepository) {
        this.sysLogRepository = sysLogRepository;
    }

    /**
     * {@code POST  /sys-logs} : Create a new sysLog.
     *
     * @param sysLog the sysLog to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sysLog, or with status {@code 400 (Bad Request)} if the sysLog has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sys-logs")
    public ResponseEntity<SysLog> createSysLog(@Valid @RequestBody SysLog sysLog) throws URISyntaxException {
        log.debug("REST request to save SysLog : {}", sysLog);
        if (sysLog.getId() != null) {
            throw new BadRequestAlertException("A new sysLog cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SysLog result = sysLogRepository.save(sysLog);
        return ResponseEntity
            .created(new URI("/api/sys-logs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sys-logs/:id} : Updates an existing sysLog.
     *
     * @param id the id of the sysLog to save.
     * @param sysLog the sysLog to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sysLog,
     * or with status {@code 400 (Bad Request)} if the sysLog is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sysLog couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sys-logs/{id}")
    public ResponseEntity<SysLog> updateSysLog(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SysLog sysLog
    ) throws URISyntaxException {
        log.debug("REST request to update SysLog : {}, {}", id, sysLog);
        if (sysLog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sysLog.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sysLogRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SysLog result = sysLogRepository.save(sysLog);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sysLog.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sys-logs/:id} : Partial updates given fields of an existing sysLog, field will ignore if it is null
     *
     * @param id the id of the sysLog to save.
     * @param sysLog the sysLog to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sysLog,
     * or with status {@code 400 (Bad Request)} if the sysLog is not valid,
     * or with status {@code 404 (Not Found)} if the sysLog is not found,
     * or with status {@code 500 (Internal Server Error)} if the sysLog couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sys-logs/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<SysLog> partialUpdateSysLog(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SysLog sysLog
    ) throws URISyntaxException {
        log.debug("REST request to partial update SysLog partially : {}, {}", id, sysLog);
        if (sysLog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sysLog.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sysLogRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SysLog> result = sysLogRepository
            .findById(sysLog.getId())
            .map(
                existingSysLog -> {
                    if (sysLog.getiDSysLog() != null) {
                        existingSysLog.setiDSysLog(sysLog.getiDSysLog());
                    }
                    if (sysLog.getLogDateTime() != null) {
                        existingSysLog.setLogDateTime(sysLog.getLogDateTime());
                    }
                    if (sysLog.getAction() != null) {
                        existingSysLog.setAction(sysLog.getAction());
                    }

                    return existingSysLog;
                }
            )
            .map(sysLogRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sysLog.getId().toString())
        );
    }

    /**
     * {@code GET  /sys-logs} : get all the sysLogs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sysLogs in body.
     */
    @GetMapping("/sys-logs")
    public List<SysLog> getAllSysLogs() {
        log.debug("REST request to get all SysLogs");
        return sysLogRepository.findAll();
    }

    /**
     * {@code GET  /sys-logs/:id} : get the "id" sysLog.
     *
     * @param id the id of the sysLog to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sysLog, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sys-logs/{id}")
    public ResponseEntity<SysLog> getSysLog(@PathVariable Long id) {
        log.debug("REST request to get SysLog : {}", id);
        Optional<SysLog> sysLog = sysLogRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sysLog);
    }

    /**
     * {@code DELETE  /sys-logs/:id} : delete the "id" sysLog.
     *
     * @param id the id of the sysLog to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sys-logs/{id}")
    public ResponseEntity<Void> deleteSysLog(@PathVariable Long id) {
        log.debug("REST request to delete SysLog : {}", id);
        sysLogRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

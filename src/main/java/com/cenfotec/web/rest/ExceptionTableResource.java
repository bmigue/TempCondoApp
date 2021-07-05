package com.cenfotec.web.rest;

import com.cenfotec.domain.ExceptionTable;
import com.cenfotec.repository.ExceptionTableRepository;
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
 * REST controller for managing {@link com.cenfotec.domain.ExceptionTable}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ExceptionTableResource {

    private final Logger log = LoggerFactory.getLogger(ExceptionTableResource.class);

    private static final String ENTITY_NAME = "exceptionTable";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExceptionTableRepository exceptionTableRepository;

    public ExceptionTableResource(ExceptionTableRepository exceptionTableRepository) {
        this.exceptionTableRepository = exceptionTableRepository;
    }

    /**
     * {@code POST  /exception-tables} : Create a new exceptionTable.
     *
     * @param exceptionTable the exceptionTable to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new exceptionTable, or with status {@code 400 (Bad Request)} if the exceptionTable has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/exception-tables")
    public ResponseEntity<ExceptionTable> createExceptionTable(@Valid @RequestBody ExceptionTable exceptionTable)
        throws URISyntaxException {
        log.debug("REST request to save ExceptionTable : {}", exceptionTable);
        if (exceptionTable.getId() != null) {
            throw new BadRequestAlertException("A new exceptionTable cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ExceptionTable result = exceptionTableRepository.save(exceptionTable);
        return ResponseEntity
            .created(new URI("/api/exception-tables/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /exception-tables/:id} : Updates an existing exceptionTable.
     *
     * @param id the id of the exceptionTable to save.
     * @param exceptionTable the exceptionTable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated exceptionTable,
     * or with status {@code 400 (Bad Request)} if the exceptionTable is not valid,
     * or with status {@code 500 (Internal Server Error)} if the exceptionTable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/exception-tables/{id}")
    public ResponseEntity<ExceptionTable> updateExceptionTable(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ExceptionTable exceptionTable
    ) throws URISyntaxException {
        log.debug("REST request to update ExceptionTable : {}, {}", id, exceptionTable);
        if (exceptionTable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, exceptionTable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!exceptionTableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ExceptionTable result = exceptionTableRepository.save(exceptionTable);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, exceptionTable.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /exception-tables/:id} : Partial updates given fields of an existing exceptionTable, field will ignore if it is null
     *
     * @param id the id of the exceptionTable to save.
     * @param exceptionTable the exceptionTable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated exceptionTable,
     * or with status {@code 400 (Bad Request)} if the exceptionTable is not valid,
     * or with status {@code 404 (Not Found)} if the exceptionTable is not found,
     * or with status {@code 500 (Internal Server Error)} if the exceptionTable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/exception-tables/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<ExceptionTable> partialUpdateExceptionTable(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ExceptionTable exceptionTable
    ) throws URISyntaxException {
        log.debug("REST request to partial update ExceptionTable partially : {}, {}", id, exceptionTable);
        if (exceptionTable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, exceptionTable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!exceptionTableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ExceptionTable> result = exceptionTableRepository
            .findById(exceptionTable.getId())
            .map(
                existingExceptionTable -> {
                    if (exceptionTable.getiDException() != null) {
                        existingExceptionTable.setiDException(exceptionTable.getiDException());
                    }
                    if (exceptionTable.getMessage() != null) {
                        existingExceptionTable.setMessage(exceptionTable.getMessage());
                    }
                    if (exceptionTable.getNumber() != null) {
                        existingExceptionTable.setNumber(exceptionTable.getNumber());
                    }

                    return existingExceptionTable;
                }
            )
            .map(exceptionTableRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, exceptionTable.getId().toString())
        );
    }

    /**
     * {@code GET  /exception-tables} : get all the exceptionTables.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exceptionTables in body.
     */
    @GetMapping("/exception-tables")
    public List<ExceptionTable> getAllExceptionTables() {
        log.debug("REST request to get all ExceptionTables");
        return exceptionTableRepository.findAll();
    }

    /**
     * {@code GET  /exception-tables/:id} : get the "id" exceptionTable.
     *
     * @param id the id of the exceptionTable to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the exceptionTable, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/exception-tables/{id}")
    public ResponseEntity<ExceptionTable> getExceptionTable(@PathVariable Long id) {
        log.debug("REST request to get ExceptionTable : {}", id);
        Optional<ExceptionTable> exceptionTable = exceptionTableRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(exceptionTable);
    }

    /**
     * {@code DELETE  /exception-tables/:id} : delete the "id" exceptionTable.
     *
     * @param id the id of the exceptionTable to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/exception-tables/{id}")
    public ResponseEntity<Void> deleteExceptionTable(@PathVariable Long id) {
        log.debug("REST request to delete ExceptionTable : {}", id);
        exceptionTableRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

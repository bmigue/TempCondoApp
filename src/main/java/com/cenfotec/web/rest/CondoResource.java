package com.cenfotec.web.rest;

import com.cenfotec.domain.Condo;
import com.cenfotec.repository.CondoRepository;
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
 * REST controller for managing {@link com.cenfotec.domain.Condo}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CondoResource {

    private final Logger log = LoggerFactory.getLogger(CondoResource.class);

    private static final String ENTITY_NAME = "condo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CondoRepository condoRepository;

    public CondoResource(CondoRepository condoRepository) {
        this.condoRepository = condoRepository;
    }

    /**
     * {@code POST  /condos} : Create a new condo.
     *
     * @param condo the condo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new condo, or with status {@code 400 (Bad Request)} if the condo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/condos")
    public ResponseEntity<Condo> createCondo(@Valid @RequestBody Condo condo) throws URISyntaxException {
        log.debug("REST request to save Condo : {}", condo);
        if (condo.getId() != null) {
            throw new BadRequestAlertException("A new condo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Condo result = condoRepository.save(condo);
        return ResponseEntity
            .created(new URI("/api/condos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /condos/:id} : Updates an existing condo.
     *
     * @param id the id of the condo to save.
     * @param condo the condo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated condo,
     * or with status {@code 400 (Bad Request)} if the condo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the condo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/condos/{id}")
    public ResponseEntity<Condo> updateCondo(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Condo condo)
        throws URISyntaxException {
        log.debug("REST request to update Condo : {}, {}", id, condo);
        if (condo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, condo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!condoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Condo result = condoRepository.save(condo);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, condo.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /condos/:id} : Partial updates given fields of an existing condo, field will ignore if it is null
     *
     * @param id the id of the condo to save.
     * @param condo the condo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated condo,
     * or with status {@code 400 (Bad Request)} if the condo is not valid,
     * or with status {@code 404 (Not Found)} if the condo is not found,
     * or with status {@code 500 (Internal Server Error)} if the condo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/condos/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Condo> partialUpdateCondo(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Condo condo
    ) throws URISyntaxException {
        log.debug("REST request to partial update Condo partially : {}, {}", id, condo);
        if (condo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, condo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!condoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Condo> result = condoRepository
            .findById(condo.getId())
            .map(
                existingCondo -> {
                    if (condo.getiDCondo() != null) {
                        existingCondo.setiDCondo(condo.getiDCondo());
                    }
                    if (condo.getNombre() != null) {
                        existingCondo.setNombre(condo.getNombre());
                    }

                    return existingCondo;
                }
            )
            .map(condoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, condo.getId().toString())
        );
    }

    /**
     * {@code GET  /condos} : get all the condos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of condos in body.
     */
    @GetMapping("/condos")
    public List<Condo> getAllCondos() {
        log.debug("REST request to get all Condos");
        return condoRepository.findAll();
    }

    /**
     * {@code GET  /condos/:id} : get the "id" condo.
     *
     * @param id the id of the condo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the condo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/condos/{id}")
    public ResponseEntity<Condo> getCondo(@PathVariable Long id) {
        log.debug("REST request to get Condo : {}", id);
        Optional<Condo> condo = condoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(condo);
    }

    /**
     * {@code DELETE  /condos/:id} : delete the "id" condo.
     *
     * @param id the id of the condo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/condos/{id}")
    public ResponseEntity<Void> deleteCondo(@PathVariable Long id) {
        log.debug("REST request to delete Condo : {}", id);
        condoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

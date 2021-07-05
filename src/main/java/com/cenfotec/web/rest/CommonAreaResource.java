package com.cenfotec.web.rest;

import com.cenfotec.domain.CommonArea;
import com.cenfotec.repository.CommonAreaRepository;
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
 * REST controller for managing {@link com.cenfotec.domain.CommonArea}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CommonAreaResource {

    private final Logger log = LoggerFactory.getLogger(CommonAreaResource.class);

    private static final String ENTITY_NAME = "commonArea";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CommonAreaRepository commonAreaRepository;

    public CommonAreaResource(CommonAreaRepository commonAreaRepository) {
        this.commonAreaRepository = commonAreaRepository;
    }

    /**
     * {@code POST  /common-areas} : Create a new commonArea.
     *
     * @param commonArea the commonArea to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new commonArea, or with status {@code 400 (Bad Request)} if the commonArea has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/common-areas")
    public ResponseEntity<CommonArea> createCommonArea(@Valid @RequestBody CommonArea commonArea) throws URISyntaxException {
        log.debug("REST request to save CommonArea : {}", commonArea);
        if (commonArea.getId() != null) {
            throw new BadRequestAlertException("A new commonArea cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CommonArea result = commonAreaRepository.save(commonArea);
        return ResponseEntity
            .created(new URI("/api/common-areas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /common-areas/:id} : Updates an existing commonArea.
     *
     * @param id the id of the commonArea to save.
     * @param commonArea the commonArea to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated commonArea,
     * or with status {@code 400 (Bad Request)} if the commonArea is not valid,
     * or with status {@code 500 (Internal Server Error)} if the commonArea couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/common-areas/{id}")
    public ResponseEntity<CommonArea> updateCommonArea(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CommonArea commonArea
    ) throws URISyntaxException {
        log.debug("REST request to update CommonArea : {}, {}", id, commonArea);
        if (commonArea.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, commonArea.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!commonAreaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CommonArea result = commonAreaRepository.save(commonArea);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, commonArea.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /common-areas/:id} : Partial updates given fields of an existing commonArea, field will ignore if it is null
     *
     * @param id the id of the commonArea to save.
     * @param commonArea the commonArea to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated commonArea,
     * or with status {@code 400 (Bad Request)} if the commonArea is not valid,
     * or with status {@code 404 (Not Found)} if the commonArea is not found,
     * or with status {@code 500 (Internal Server Error)} if the commonArea couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/common-areas/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<CommonArea> partialUpdateCommonArea(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CommonArea commonArea
    ) throws URISyntaxException {
        log.debug("REST request to partial update CommonArea partially : {}, {}", id, commonArea);
        if (commonArea.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, commonArea.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!commonAreaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CommonArea> result = commonAreaRepository
            .findById(commonArea.getId())
            .map(
                existingCommonArea -> {
                    if (commonArea.getiDCommonArea() != null) {
                        existingCommonArea.setiDCommonArea(commonArea.getiDCommonArea());
                    }
                    if (commonArea.getStatus() != null) {
                        existingCommonArea.setStatus(commonArea.getStatus());
                    }
                    if (commonArea.getName() != null) {
                        existingCommonArea.setName(commonArea.getName());
                    }

                    return existingCommonArea;
                }
            )
            .map(commonAreaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, commonArea.getId().toString())
        );
    }

    /**
     * {@code GET  /common-areas} : get all the commonAreas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of commonAreas in body.
     */
    @GetMapping("/common-areas")
    public List<CommonArea> getAllCommonAreas() {
        log.debug("REST request to get all CommonAreas");
        return commonAreaRepository.findAll();
    }

    /**
     * {@code GET  /common-areas/:id} : get the "id" commonArea.
     *
     * @param id the id of the commonArea to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the commonArea, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/common-areas/{id}")
    public ResponseEntity<CommonArea> getCommonArea(@PathVariable Long id) {
        log.debug("REST request to get CommonArea : {}", id);
        Optional<CommonArea> commonArea = commonAreaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(commonArea);
    }

    /**
     * {@code DELETE  /common-areas/:id} : delete the "id" commonArea.
     *
     * @param id the id of the commonArea to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/common-areas/{id}")
    public ResponseEntity<Void> deleteCommonArea(@PathVariable Long id) {
        log.debug("REST request to delete CommonArea : {}", id);
        commonAreaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

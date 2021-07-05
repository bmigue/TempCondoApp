package com.cenfotec.web.rest;

import com.cenfotec.domain.GeneralForum;
import com.cenfotec.repository.GeneralForumRepository;
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
 * REST controller for managing {@link com.cenfotec.domain.GeneralForum}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GeneralForumResource {

    private final Logger log = LoggerFactory.getLogger(GeneralForumResource.class);

    private static final String ENTITY_NAME = "generalForum";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GeneralForumRepository generalForumRepository;

    public GeneralForumResource(GeneralForumRepository generalForumRepository) {
        this.generalForumRepository = generalForumRepository;
    }

    /**
     * {@code POST  /general-forums} : Create a new generalForum.
     *
     * @param generalForum the generalForum to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new generalForum, or with status {@code 400 (Bad Request)} if the generalForum has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/general-forums")
    public ResponseEntity<GeneralForum> createGeneralForum(@Valid @RequestBody GeneralForum generalForum) throws URISyntaxException {
        log.debug("REST request to save GeneralForum : {}", generalForum);
        if (generalForum.getId() != null) {
            throw new BadRequestAlertException("A new generalForum cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GeneralForum result = generalForumRepository.save(generalForum);
        return ResponseEntity
            .created(new URI("/api/general-forums/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /general-forums/:id} : Updates an existing generalForum.
     *
     * @param id the id of the generalForum to save.
     * @param generalForum the generalForum to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated generalForum,
     * or with status {@code 400 (Bad Request)} if the generalForum is not valid,
     * or with status {@code 500 (Internal Server Error)} if the generalForum couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/general-forums/{id}")
    public ResponseEntity<GeneralForum> updateGeneralForum(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody GeneralForum generalForum
    ) throws URISyntaxException {
        log.debug("REST request to update GeneralForum : {}, {}", id, generalForum);
        if (generalForum.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, generalForum.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!generalForumRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        GeneralForum result = generalForumRepository.save(generalForum);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, generalForum.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /general-forums/:id} : Partial updates given fields of an existing generalForum, field will ignore if it is null
     *
     * @param id the id of the generalForum to save.
     * @param generalForum the generalForum to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated generalForum,
     * or with status {@code 400 (Bad Request)} if the generalForum is not valid,
     * or with status {@code 404 (Not Found)} if the generalForum is not found,
     * or with status {@code 500 (Internal Server Error)} if the generalForum couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/general-forums/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<GeneralForum> partialUpdateGeneralForum(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody GeneralForum generalForum
    ) throws URISyntaxException {
        log.debug("REST request to partial update GeneralForum partially : {}, {}", id, generalForum);
        if (generalForum.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, generalForum.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!generalForumRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GeneralForum> result = generalForumRepository
            .findById(generalForum.getId())
            .map(
                existingGeneralForum -> {
                    if (generalForum.getiDGeneralForum() != null) {
                        existingGeneralForum.setiDGeneralForum(generalForum.getiDGeneralForum());
                    }
                    if (generalForum.getPostDate() != null) {
                        existingGeneralForum.setPostDate(generalForum.getPostDate());
                    }
                    if (generalForum.getPost() != null) {
                        existingGeneralForum.setPost(generalForum.getPost());
                    }

                    return existingGeneralForum;
                }
            )
            .map(generalForumRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, generalForum.getId().toString())
        );
    }

    /**
     * {@code GET  /general-forums} : get all the generalForums.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of generalForums in body.
     */
    @GetMapping("/general-forums")
    public List<GeneralForum> getAllGeneralForums() {
        log.debug("REST request to get all GeneralForums");
        return generalForumRepository.findAll();
    }

    /**
     * {@code GET  /general-forums/:id} : get the "id" generalForum.
     *
     * @param id the id of the generalForum to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the generalForum, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/general-forums/{id}")
    public ResponseEntity<GeneralForum> getGeneralForum(@PathVariable Long id) {
        log.debug("REST request to get GeneralForum : {}", id);
        Optional<GeneralForum> generalForum = generalForumRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(generalForum);
    }

    /**
     * {@code DELETE  /general-forums/:id} : delete the "id" generalForum.
     *
     * @param id the id of the generalForum to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/general-forums/{id}")
    public ResponseEntity<Void> deleteGeneralForum(@PathVariable Long id) {
        log.debug("REST request to delete GeneralForum : {}", id);
        generalForumRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

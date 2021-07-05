package com.cenfotec.web.rest;

import com.cenfotec.domain.AdminWall;
import com.cenfotec.repository.AdminWallRepository;
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
 * REST controller for managing {@link com.cenfotec.domain.AdminWall}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AdminWallResource {

    private final Logger log = LoggerFactory.getLogger(AdminWallResource.class);

    private static final String ENTITY_NAME = "adminWall";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AdminWallRepository adminWallRepository;

    public AdminWallResource(AdminWallRepository adminWallRepository) {
        this.adminWallRepository = adminWallRepository;
    }

    /**
     * {@code POST  /admin-walls} : Create a new adminWall.
     *
     * @param adminWall the adminWall to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new adminWall, or with status {@code 400 (Bad Request)} if the adminWall has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/admin-walls")
    public ResponseEntity<AdminWall> createAdminWall(@Valid @RequestBody AdminWall adminWall) throws URISyntaxException {
        log.debug("REST request to save AdminWall : {}", adminWall);
        if (adminWall.getId() != null) {
            throw new BadRequestAlertException("A new adminWall cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AdminWall result = adminWallRepository.save(adminWall);
        return ResponseEntity
            .created(new URI("/api/admin-walls/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /admin-walls/:id} : Updates an existing adminWall.
     *
     * @param id the id of the adminWall to save.
     * @param adminWall the adminWall to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated adminWall,
     * or with status {@code 400 (Bad Request)} if the adminWall is not valid,
     * or with status {@code 500 (Internal Server Error)} if the adminWall couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/admin-walls/{id}")
    public ResponseEntity<AdminWall> updateAdminWall(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AdminWall adminWall
    ) throws URISyntaxException {
        log.debug("REST request to update AdminWall : {}, {}", id, adminWall);
        if (adminWall.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, adminWall.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!adminWallRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AdminWall result = adminWallRepository.save(adminWall);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, adminWall.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /admin-walls/:id} : Partial updates given fields of an existing adminWall, field will ignore if it is null
     *
     * @param id the id of the adminWall to save.
     * @param adminWall the adminWall to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated adminWall,
     * or with status {@code 400 (Bad Request)} if the adminWall is not valid,
     * or with status {@code 404 (Not Found)} if the adminWall is not found,
     * or with status {@code 500 (Internal Server Error)} if the adminWall couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/admin-walls/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<AdminWall> partialUpdateAdminWall(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AdminWall adminWall
    ) throws URISyntaxException {
        log.debug("REST request to partial update AdminWall partially : {}, {}", id, adminWall);
        if (adminWall.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, adminWall.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!adminWallRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AdminWall> result = adminWallRepository
            .findById(adminWall.getId())
            .map(
                existingAdminWall -> {
                    if (adminWall.getiDAdminWall() != null) {
                        existingAdminWall.setiDAdminWall(adminWall.getiDAdminWall());
                    }
                    if (adminWall.getPostDate() != null) {
                        existingAdminWall.setPostDate(adminWall.getPostDate());
                    }
                    if (adminWall.getPost() != null) {
                        existingAdminWall.setPost(adminWall.getPost());
                    }

                    return existingAdminWall;
                }
            )
            .map(adminWallRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, adminWall.getId().toString())
        );
    }

    /**
     * {@code GET  /admin-walls} : get all the adminWalls.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of adminWalls in body.
     */
    @GetMapping("/admin-walls")
    public List<AdminWall> getAllAdminWalls() {
        log.debug("REST request to get all AdminWalls");
        return adminWallRepository.findAll();
    }

    /**
     * {@code GET  /admin-walls/:id} : get the "id" adminWall.
     *
     * @param id the id of the adminWall to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the adminWall, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/admin-walls/{id}")
    public ResponseEntity<AdminWall> getAdminWall(@PathVariable Long id) {
        log.debug("REST request to get AdminWall : {}", id);
        Optional<AdminWall> adminWall = adminWallRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(adminWall);
    }

    /**
     * {@code DELETE  /admin-walls/:id} : delete the "id" adminWall.
     *
     * @param id the id of the adminWall to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/admin-walls/{id}")
    public ResponseEntity<Void> deleteAdminWall(@PathVariable Long id) {
        log.debug("REST request to delete AdminWall : {}", id);
        adminWallRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

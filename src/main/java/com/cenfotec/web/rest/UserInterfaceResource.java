package com.cenfotec.web.rest;

import com.cenfotec.domain.UserInterface;
import com.cenfotec.repository.UserInterfaceRepository;
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
 * REST controller for managing {@link com.cenfotec.domain.UserInterface}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserInterfaceResource {

    private final Logger log = LoggerFactory.getLogger(UserInterfaceResource.class);

    private static final String ENTITY_NAME = "userInterface";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserInterfaceRepository userInterfaceRepository;

    public UserInterfaceResource(UserInterfaceRepository userInterfaceRepository) {
        this.userInterfaceRepository = userInterfaceRepository;
    }

    /**
     * {@code POST  /user-interfaces} : Create a new userInterface.
     *
     * @param userInterface the userInterface to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userInterface, or with status {@code 400 (Bad Request)} if the userInterface has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-interfaces")
    public ResponseEntity<UserInterface> createUserInterface(@Valid @RequestBody UserInterface userInterface) throws URISyntaxException {
        log.debug("REST request to save UserInterface : {}", userInterface);
        if (userInterface.getId() != null) {
            throw new BadRequestAlertException("A new userInterface cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserInterface result = userInterfaceRepository.save(userInterface);
        return ResponseEntity
            .created(new URI("/api/user-interfaces/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-interfaces/:id} : Updates an existing userInterface.
     *
     * @param id the id of the userInterface to save.
     * @param userInterface the userInterface to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userInterface,
     * or with status {@code 400 (Bad Request)} if the userInterface is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userInterface couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-interfaces/{id}")
    public ResponseEntity<UserInterface> updateUserInterface(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody UserInterface userInterface
    ) throws URISyntaxException {
        log.debug("REST request to update UserInterface : {}, {}", id, userInterface);
        if (userInterface.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userInterface.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userInterfaceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserInterface result = userInterfaceRepository.save(userInterface);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userInterface.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-interfaces/:id} : Partial updates given fields of an existing userInterface, field will ignore if it is null
     *
     * @param id the id of the userInterface to save.
     * @param userInterface the userInterface to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userInterface,
     * or with status {@code 400 (Bad Request)} if the userInterface is not valid,
     * or with status {@code 404 (Not Found)} if the userInterface is not found,
     * or with status {@code 500 (Internal Server Error)} if the userInterface couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-interfaces/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<UserInterface> partialUpdateUserInterface(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UserInterface userInterface
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserInterface partially : {}, {}", id, userInterface);
        if (userInterface.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userInterface.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userInterfaceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserInterface> result = userInterfaceRepository
            .findById(userInterface.getId())
            .map(
                existingUserInterface -> {
                    if (userInterface.getiDUserInterface() != null) {
                        existingUserInterface.setiDUserInterface(userInterface.getiDUserInterface());
                    }
                    if (userInterface.getThemeName() != null) {
                        existingUserInterface.setThemeName(userInterface.getThemeName());
                    }
                    if (userInterface.getColor() != null) {
                        existingUserInterface.setColor(userInterface.getColor());
                    }

                    return existingUserInterface;
                }
            )
            .map(userInterfaceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userInterface.getId().toString())
        );
    }

    /**
     * {@code GET  /user-interfaces} : get all the userInterfaces.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userInterfaces in body.
     */
    @GetMapping("/user-interfaces")
    public List<UserInterface> getAllUserInterfaces() {
        log.debug("REST request to get all UserInterfaces");
        return userInterfaceRepository.findAll();
    }

    /**
     * {@code GET  /user-interfaces/:id} : get the "id" userInterface.
     *
     * @param id the id of the userInterface to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userInterface, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-interfaces/{id}")
    public ResponseEntity<UserInterface> getUserInterface(@PathVariable Long id) {
        log.debug("REST request to get UserInterface : {}", id);
        Optional<UserInterface> userInterface = userInterfaceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userInterface);
    }

    /**
     * {@code DELETE  /user-interfaces/:id} : delete the "id" userInterface.
     *
     * @param id the id of the userInterface to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-interfaces/{id}")
    public ResponseEntity<Void> deleteUserInterface(@PathVariable Long id) {
        log.debug("REST request to delete UserInterface : {}", id);
        userInterfaceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

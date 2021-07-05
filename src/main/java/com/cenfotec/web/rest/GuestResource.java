package com.cenfotec.web.rest;

import com.cenfotec.domain.Guest;
import com.cenfotec.repository.GuestRepository;
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
 * REST controller for managing {@link com.cenfotec.domain.Guest}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GuestResource {

    private final Logger log = LoggerFactory.getLogger(GuestResource.class);

    private static final String ENTITY_NAME = "guest";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GuestRepository guestRepository;

    public GuestResource(GuestRepository guestRepository) {
        this.guestRepository = guestRepository;
    }

    /**
     * {@code POST  /guests} : Create a new guest.
     *
     * @param guest the guest to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new guest, or with status {@code 400 (Bad Request)} if the guest has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/guests")
    public ResponseEntity<Guest> createGuest(@Valid @RequestBody Guest guest) throws URISyntaxException {
        log.debug("REST request to save Guest : {}", guest);
        if (guest.getId() != null) {
            throw new BadRequestAlertException("A new guest cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Guest result = guestRepository.save(guest);
        return ResponseEntity
            .created(new URI("/api/guests/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /guests/:id} : Updates an existing guest.
     *
     * @param id the id of the guest to save.
     * @param guest the guest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated guest,
     * or with status {@code 400 (Bad Request)} if the guest is not valid,
     * or with status {@code 500 (Internal Server Error)} if the guest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/guests/{id}")
    public ResponseEntity<Guest> updateGuest(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Guest guest)
        throws URISyntaxException {
        log.debug("REST request to update Guest : {}, {}", id, guest);
        if (guest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, guest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!guestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Guest result = guestRepository.save(guest);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, guest.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /guests/:id} : Partial updates given fields of an existing guest, field will ignore if it is null
     *
     * @param id the id of the guest to save.
     * @param guest the guest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated guest,
     * or with status {@code 400 (Bad Request)} if the guest is not valid,
     * or with status {@code 404 (Not Found)} if the guest is not found,
     * or with status {@code 500 (Internal Server Error)} if the guest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/guests/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Guest> partialUpdateGuest(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Guest guest
    ) throws URISyntaxException {
        log.debug("REST request to partial update Guest partially : {}, {}", id, guest);
        if (guest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, guest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!guestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Guest> result = guestRepository
            .findById(guest.getId())
            .map(
                existingGuest -> {
                    if (guest.getiDGuest() != null) {
                        existingGuest.setiDGuest(guest.getiDGuest());
                    }
                    if (guest.getFullName() != null) {
                        existingGuest.setFullName(guest.getFullName());
                    }
                    if (guest.getPlateNumber() != null) {
                        existingGuest.setPlateNumber(guest.getPlateNumber());
                    }
                    if (guest.getStatus() != null) {
                        existingGuest.setStatus(guest.getStatus());
                    }

                    return existingGuest;
                }
            )
            .map(guestRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, guest.getId().toString())
        );
    }

    /**
     * {@code GET  /guests} : get all the guests.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of guests in body.
     */
    @GetMapping("/guests")
    public List<Guest> getAllGuests() {
        log.debug("REST request to get all Guests");
        return guestRepository.findAll();
    }

    /**
     * {@code GET  /guests/:id} : get the "id" guest.
     *
     * @param id the id of the guest to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the guest, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/guests/{id}")
    public ResponseEntity<Guest> getGuest(@PathVariable Long id) {
        log.debug("REST request to get Guest : {}", id);
        Optional<Guest> guest = guestRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(guest);
    }

    /**
     * {@code DELETE  /guests/:id} : delete the "id" guest.
     *
     * @param id the id of the guest to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/guests/{id}")
    public ResponseEntity<Void> deleteGuest(@PathVariable Long id) {
        log.debug("REST request to delete Guest : {}", id);
        guestRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

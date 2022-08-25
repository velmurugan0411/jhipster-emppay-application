package com.techfinite.lms.web.rest;

import com.techfinite.lms.domain.Schedules;
import com.techfinite.lms.repository.SchedulesRepository;
import com.techfinite.lms.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.techfinite.lms.domain.Schedules}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SchedulesResource {

    private final Logger log = LoggerFactory.getLogger(SchedulesResource.class);

    private static final String ENTITY_NAME = "schedules";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SchedulesRepository schedulesRepository;

    public SchedulesResource(SchedulesRepository schedulesRepository) {
        this.schedulesRepository = schedulesRepository;
    }

    /**
     * {@code POST  /schedules} : Create a new schedules.
     *
     * @param schedules the schedules to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new schedules, or with status {@code 400 (Bad Request)} if the schedules has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/schedules")
    public ResponseEntity<Schedules> createSchedules(@RequestBody Schedules schedules) throws URISyntaxException {
        log.debug("REST request to save Schedules : {}", schedules);
        if (schedules.getId() != null) {
            throw new BadRequestAlertException("A new schedules cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Schedules result = schedulesRepository.save(schedules);
        return ResponseEntity
            .created(new URI("/api/schedules/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /schedules/:id} : Updates an existing schedules.
     *
     * @param id the id of the schedules to save.
     * @param schedules the schedules to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated schedules,
     * or with status {@code 400 (Bad Request)} if the schedules is not valid,
     * or with status {@code 500 (Internal Server Error)} if the schedules couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/schedules/{id}")
    public ResponseEntity<Schedules> updateSchedules(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Schedules schedules
    ) throws URISyntaxException {
        log.debug("REST request to update Schedules : {}, {}", id, schedules);
        if (schedules.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, schedules.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!schedulesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Schedules result = schedulesRepository.save(schedules);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, schedules.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /schedules/:id} : Partial updates given fields of an existing schedules, field will ignore if it is null
     *
     * @param id the id of the schedules to save.
     * @param schedules the schedules to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated schedules,
     * or with status {@code 400 (Bad Request)} if the schedules is not valid,
     * or with status {@code 404 (Not Found)} if the schedules is not found,
     * or with status {@code 500 (Internal Server Error)} if the schedules couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/schedules/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Schedules> partialUpdateSchedules(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Schedules schedules
    ) throws URISyntaxException {
        log.debug("REST request to partial update Schedules partially : {}, {}", id, schedules);
        if (schedules.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, schedules.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!schedulesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Schedules> result = schedulesRepository
            .findById(schedules.getId())
            .map(existingSchedules -> {
                if (schedules.getScheduleId() != null) {
                    existingSchedules.setScheduleId(schedules.getScheduleId());
                }
                if (schedules.getScheduleName() != null) {
                    existingSchedules.setScheduleName(schedules.getScheduleName());
                }
                if (schedules.getScheduleBeginDate() != null) {
                    existingSchedules.setScheduleBeginDate(schedules.getScheduleBeginDate());
                }
                if (schedules.getScheduleEndDate() != null) {
                    existingSchedules.setScheduleEndDate(schedules.getScheduleEndDate());
                }

                return existingSchedules;
            })
            .map(schedulesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, schedules.getId().toString())
        );
    }

    /**
     * {@code GET  /schedules} : get all the schedules.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of schedules in body.
     */
    @GetMapping("/schedules")
    public List<Schedules> getAllSchedules() {
        log.debug("REST request to get all Schedules");
        return schedulesRepository.findAll();
    }

    /**
     * {@code GET  /schedules/:id} : get the "id" schedules.
     *
     * @param id the id of the schedules to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the schedules, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/schedules/{id}")
    public ResponseEntity<Schedules> getSchedules(@PathVariable Long id) {
        log.debug("REST request to get Schedules : {}", id);
        Optional<Schedules> schedules = schedulesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(schedules);
    }

    /**
     * {@code DELETE  /schedules/:id} : delete the "id" schedules.
     *
     * @param id the id of the schedules to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/schedules/{id}")
    public ResponseEntity<Void> deleteSchedules(@PathVariable Long id) {
        log.debug("REST request to delete Schedules : {}", id);
        schedulesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

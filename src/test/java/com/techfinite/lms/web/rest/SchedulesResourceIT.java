package com.techfinite.lms.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.techfinite.lms.IntegrationTest;
import com.techfinite.lms.domain.Schedules;
import com.techfinite.lms.repository.SchedulesRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SchedulesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SchedulesResourceIT {

    private static final Integer DEFAULT_SCHEDULE_ID = 1;
    private static final Integer UPDATED_SCHEDULE_ID = 2;

    private static final String DEFAULT_SCHEDULE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_SCHEDULE_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_SCHEDULE_BEGIN_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_SCHEDULE_BEGIN_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_SCHEDULE_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_SCHEDULE_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/schedules";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SchedulesRepository schedulesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSchedulesMockMvc;

    private Schedules schedules;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Schedules createEntity(EntityManager em) {
        Schedules schedules = new Schedules()
            .scheduleId(DEFAULT_SCHEDULE_ID)
            .scheduleName(DEFAULT_SCHEDULE_NAME)
            .scheduleBeginDate(DEFAULT_SCHEDULE_BEGIN_DATE)
            .scheduleEndDate(DEFAULT_SCHEDULE_END_DATE);
        return schedules;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Schedules createUpdatedEntity(EntityManager em) {
        Schedules schedules = new Schedules()
            .scheduleId(UPDATED_SCHEDULE_ID)
            .scheduleName(UPDATED_SCHEDULE_NAME)
            .scheduleBeginDate(UPDATED_SCHEDULE_BEGIN_DATE)
            .scheduleEndDate(UPDATED_SCHEDULE_END_DATE);
        return schedules;
    }

    @BeforeEach
    public void initTest() {
        schedules = createEntity(em);
    }

    @Test
    @Transactional
    void createSchedules() throws Exception {
        int databaseSizeBeforeCreate = schedulesRepository.findAll().size();
        // Create the Schedules
        restSchedulesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(schedules)))
            .andExpect(status().isCreated());

        // Validate the Schedules in the database
        List<Schedules> schedulesList = schedulesRepository.findAll();
        assertThat(schedulesList).hasSize(databaseSizeBeforeCreate + 1);
        Schedules testSchedules = schedulesList.get(schedulesList.size() - 1);
        assertThat(testSchedules.getScheduleId()).isEqualTo(DEFAULT_SCHEDULE_ID);
        assertThat(testSchedules.getScheduleName()).isEqualTo(DEFAULT_SCHEDULE_NAME);
        assertThat(testSchedules.getScheduleBeginDate()).isEqualTo(DEFAULT_SCHEDULE_BEGIN_DATE);
        assertThat(testSchedules.getScheduleEndDate()).isEqualTo(DEFAULT_SCHEDULE_END_DATE);
    }

    @Test
    @Transactional
    void createSchedulesWithExistingId() throws Exception {
        // Create the Schedules with an existing ID
        schedules.setId(1L);

        int databaseSizeBeforeCreate = schedulesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSchedulesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(schedules)))
            .andExpect(status().isBadRequest());

        // Validate the Schedules in the database
        List<Schedules> schedulesList = schedulesRepository.findAll();
        assertThat(schedulesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSchedules() throws Exception {
        // Initialize the database
        schedulesRepository.saveAndFlush(schedules);

        // Get all the schedulesList
        restSchedulesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(schedules.getId().intValue())))
            .andExpect(jsonPath("$.[*].scheduleId").value(hasItem(DEFAULT_SCHEDULE_ID)))
            .andExpect(jsonPath("$.[*].scheduleName").value(hasItem(DEFAULT_SCHEDULE_NAME)))
            .andExpect(jsonPath("$.[*].scheduleBeginDate").value(hasItem(DEFAULT_SCHEDULE_BEGIN_DATE.toString())))
            .andExpect(jsonPath("$.[*].scheduleEndDate").value(hasItem(DEFAULT_SCHEDULE_END_DATE.toString())));
    }

    @Test
    @Transactional
    void getSchedules() throws Exception {
        // Initialize the database
        schedulesRepository.saveAndFlush(schedules);

        // Get the schedules
        restSchedulesMockMvc
            .perform(get(ENTITY_API_URL_ID, schedules.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(schedules.getId().intValue()))
            .andExpect(jsonPath("$.scheduleId").value(DEFAULT_SCHEDULE_ID))
            .andExpect(jsonPath("$.scheduleName").value(DEFAULT_SCHEDULE_NAME))
            .andExpect(jsonPath("$.scheduleBeginDate").value(DEFAULT_SCHEDULE_BEGIN_DATE.toString()))
            .andExpect(jsonPath("$.scheduleEndDate").value(DEFAULT_SCHEDULE_END_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSchedules() throws Exception {
        // Get the schedules
        restSchedulesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSchedules() throws Exception {
        // Initialize the database
        schedulesRepository.saveAndFlush(schedules);

        int databaseSizeBeforeUpdate = schedulesRepository.findAll().size();

        // Update the schedules
        Schedules updatedSchedules = schedulesRepository.findById(schedules.getId()).get();
        // Disconnect from session so that the updates on updatedSchedules are not directly saved in db
        em.detach(updatedSchedules);
        updatedSchedules
            .scheduleId(UPDATED_SCHEDULE_ID)
            .scheduleName(UPDATED_SCHEDULE_NAME)
            .scheduleBeginDate(UPDATED_SCHEDULE_BEGIN_DATE)
            .scheduleEndDate(UPDATED_SCHEDULE_END_DATE);

        restSchedulesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSchedules.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSchedules))
            )
            .andExpect(status().isOk());

        // Validate the Schedules in the database
        List<Schedules> schedulesList = schedulesRepository.findAll();
        assertThat(schedulesList).hasSize(databaseSizeBeforeUpdate);
        Schedules testSchedules = schedulesList.get(schedulesList.size() - 1);
        assertThat(testSchedules.getScheduleId()).isEqualTo(UPDATED_SCHEDULE_ID);
        assertThat(testSchedules.getScheduleName()).isEqualTo(UPDATED_SCHEDULE_NAME);
        assertThat(testSchedules.getScheduleBeginDate()).isEqualTo(UPDATED_SCHEDULE_BEGIN_DATE);
        assertThat(testSchedules.getScheduleEndDate()).isEqualTo(UPDATED_SCHEDULE_END_DATE);
    }

    @Test
    @Transactional
    void putNonExistingSchedules() throws Exception {
        int databaseSizeBeforeUpdate = schedulesRepository.findAll().size();
        schedules.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSchedulesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, schedules.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(schedules))
            )
            .andExpect(status().isBadRequest());

        // Validate the Schedules in the database
        List<Schedules> schedulesList = schedulesRepository.findAll();
        assertThat(schedulesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSchedules() throws Exception {
        int databaseSizeBeforeUpdate = schedulesRepository.findAll().size();
        schedules.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSchedulesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(schedules))
            )
            .andExpect(status().isBadRequest());

        // Validate the Schedules in the database
        List<Schedules> schedulesList = schedulesRepository.findAll();
        assertThat(schedulesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSchedules() throws Exception {
        int databaseSizeBeforeUpdate = schedulesRepository.findAll().size();
        schedules.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSchedulesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(schedules)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Schedules in the database
        List<Schedules> schedulesList = schedulesRepository.findAll();
        assertThat(schedulesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSchedulesWithPatch() throws Exception {
        // Initialize the database
        schedulesRepository.saveAndFlush(schedules);

        int databaseSizeBeforeUpdate = schedulesRepository.findAll().size();

        // Update the schedules using partial update
        Schedules partialUpdatedSchedules = new Schedules();
        partialUpdatedSchedules.setId(schedules.getId());

        partialUpdatedSchedules.scheduleEndDate(UPDATED_SCHEDULE_END_DATE);

        restSchedulesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSchedules.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSchedules))
            )
            .andExpect(status().isOk());

        // Validate the Schedules in the database
        List<Schedules> schedulesList = schedulesRepository.findAll();
        assertThat(schedulesList).hasSize(databaseSizeBeforeUpdate);
        Schedules testSchedules = schedulesList.get(schedulesList.size() - 1);
        assertThat(testSchedules.getScheduleId()).isEqualTo(DEFAULT_SCHEDULE_ID);
        assertThat(testSchedules.getScheduleName()).isEqualTo(DEFAULT_SCHEDULE_NAME);
        assertThat(testSchedules.getScheduleBeginDate()).isEqualTo(DEFAULT_SCHEDULE_BEGIN_DATE);
        assertThat(testSchedules.getScheduleEndDate()).isEqualTo(UPDATED_SCHEDULE_END_DATE);
    }

    @Test
    @Transactional
    void fullUpdateSchedulesWithPatch() throws Exception {
        // Initialize the database
        schedulesRepository.saveAndFlush(schedules);

        int databaseSizeBeforeUpdate = schedulesRepository.findAll().size();

        // Update the schedules using partial update
        Schedules partialUpdatedSchedules = new Schedules();
        partialUpdatedSchedules.setId(schedules.getId());

        partialUpdatedSchedules
            .scheduleId(UPDATED_SCHEDULE_ID)
            .scheduleName(UPDATED_SCHEDULE_NAME)
            .scheduleBeginDate(UPDATED_SCHEDULE_BEGIN_DATE)
            .scheduleEndDate(UPDATED_SCHEDULE_END_DATE);

        restSchedulesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSchedules.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSchedules))
            )
            .andExpect(status().isOk());

        // Validate the Schedules in the database
        List<Schedules> schedulesList = schedulesRepository.findAll();
        assertThat(schedulesList).hasSize(databaseSizeBeforeUpdate);
        Schedules testSchedules = schedulesList.get(schedulesList.size() - 1);
        assertThat(testSchedules.getScheduleId()).isEqualTo(UPDATED_SCHEDULE_ID);
        assertThat(testSchedules.getScheduleName()).isEqualTo(UPDATED_SCHEDULE_NAME);
        assertThat(testSchedules.getScheduleBeginDate()).isEqualTo(UPDATED_SCHEDULE_BEGIN_DATE);
        assertThat(testSchedules.getScheduleEndDate()).isEqualTo(UPDATED_SCHEDULE_END_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingSchedules() throws Exception {
        int databaseSizeBeforeUpdate = schedulesRepository.findAll().size();
        schedules.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSchedulesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, schedules.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(schedules))
            )
            .andExpect(status().isBadRequest());

        // Validate the Schedules in the database
        List<Schedules> schedulesList = schedulesRepository.findAll();
        assertThat(schedulesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSchedules() throws Exception {
        int databaseSizeBeforeUpdate = schedulesRepository.findAll().size();
        schedules.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSchedulesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(schedules))
            )
            .andExpect(status().isBadRequest());

        // Validate the Schedules in the database
        List<Schedules> schedulesList = schedulesRepository.findAll();
        assertThat(schedulesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSchedules() throws Exception {
        int databaseSizeBeforeUpdate = schedulesRepository.findAll().size();
        schedules.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSchedulesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(schedules))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Schedules in the database
        List<Schedules> schedulesList = schedulesRepository.findAll();
        assertThat(schedulesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSchedules() throws Exception {
        // Initialize the database
        schedulesRepository.saveAndFlush(schedules);

        int databaseSizeBeforeDelete = schedulesRepository.findAll().size();

        // Delete the schedules
        restSchedulesMockMvc
            .perform(delete(ENTITY_API_URL_ID, schedules.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Schedules> schedulesList = schedulesRepository.findAll();
        assertThat(schedulesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

package com.techfinite.lms.repository;

import com.techfinite.lms.domain.Schedules;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Schedules entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SchedulesRepository extends JpaRepository<Schedules, Long> {}

package com.techfinite.lms.repository;

import com.techfinite.lms.domain.Courses;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Courses entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CoursesRepository extends JpaRepository<Courses, Long> {}

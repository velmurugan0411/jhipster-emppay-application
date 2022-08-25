package com.techfinite.lms.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.techfinite.lms.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SchedulesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Schedules.class);
        Schedules schedules1 = new Schedules();
        schedules1.setId(1L);
        Schedules schedules2 = new Schedules();
        schedules2.setId(schedules1.getId());
        assertThat(schedules1).isEqualTo(schedules2);
        schedules2.setId(2L);
        assertThat(schedules1).isNotEqualTo(schedules2);
        schedules1.setId(null);
        assertThat(schedules1).isNotEqualTo(schedules2);
    }
}

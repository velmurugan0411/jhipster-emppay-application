package com.techfinite.lms.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Schedules.
 */
@Entity
@Table(name = "schedules")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Schedules implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "schedule_id")
    private Integer scheduleId;

    @Column(name = "schedule_name")
    private String scheduleName;

    @Column(name = "schedule_begin_date")
    private LocalDate scheduleBeginDate;

    @Column(name = "schedule_end_date")
    private LocalDate scheduleEndDate;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Schedules id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getScheduleId() {
        return this.scheduleId;
    }

    public Schedules scheduleId(Integer scheduleId) {
        this.setScheduleId(scheduleId);
        return this;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
    }

    public String getScheduleName() {
        return this.scheduleName;
    }

    public Schedules scheduleName(String scheduleName) {
        this.setScheduleName(scheduleName);
        return this;
    }

    public void setScheduleName(String scheduleName) {
        this.scheduleName = scheduleName;
    }

    public LocalDate getScheduleBeginDate() {
        return this.scheduleBeginDate;
    }

    public Schedules scheduleBeginDate(LocalDate scheduleBeginDate) {
        this.setScheduleBeginDate(scheduleBeginDate);
        return this;
    }

    public void setScheduleBeginDate(LocalDate scheduleBeginDate) {
        this.scheduleBeginDate = scheduleBeginDate;
    }

    public LocalDate getScheduleEndDate() {
        return this.scheduleEndDate;
    }

    public Schedules scheduleEndDate(LocalDate scheduleEndDate) {
        this.setScheduleEndDate(scheduleEndDate);
        return this;
    }

    public void setScheduleEndDate(LocalDate scheduleEndDate) {
        this.scheduleEndDate = scheduleEndDate;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Schedules)) {
            return false;
        }
        return id != null && id.equals(((Schedules) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Schedules{" +
            "id=" + getId() +
            ", scheduleId=" + getScheduleId() +
            ", scheduleName='" + getScheduleName() + "'" +
            ", scheduleBeginDate='" + getScheduleBeginDate() + "'" +
            ", scheduleEndDate='" + getScheduleEndDate() + "'" +
            "}";
    }
}

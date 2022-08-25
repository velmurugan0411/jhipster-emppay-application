package com.techfinite.lms.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Courses.
 */
@Entity
@Table(name = "courses")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Courses implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "course_id")
    private Integer courseId;

    @Column(name = "course_title")
    private String courseTitle;

    @Column(name = "course_desc")
    private String courseDesc;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Courses id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCourseId() {
        return this.courseId;
    }

    public Courses courseId(Integer courseId) {
        this.setCourseId(courseId);
        return this;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return this.courseTitle;
    }

    public Courses courseTitle(String courseTitle) {
        this.setCourseTitle(courseTitle);
        return this;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public String getCourseDesc() {
        return this.courseDesc;
    }

    public Courses courseDesc(String courseDesc) {
        this.setCourseDesc(courseDesc);
        return this;
    }

    public void setCourseDesc(String courseDesc) {
        this.courseDesc = courseDesc;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Courses)) {
            return false;
        }
        return id != null && id.equals(((Courses) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Courses{" +
            "id=" + getId() +
            ", courseId=" + getCourseId() +
            ", courseTitle='" + getCourseTitle() + "'" +
            ", courseDesc='" + getCourseDesc() + "'" +
            "}";
    }
}

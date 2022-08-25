package com.techfinite.lms.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Payroll.
 */
@Entity
@Table(name = "payroll")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Payroll implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "paymonth")
    private Integer paymonth;

    @Column(name = "amount")
    private Float amount;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Payroll id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Payroll name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPaymonth() {
        return this.paymonth;
    }

    public Payroll paymonth(Integer paymonth) {
        this.setPaymonth(paymonth);
        return this;
    }

    public void setPaymonth(Integer paymonth) {
        this.paymonth = paymonth;
    }

    public Float getAmount() {
        return this.amount;
    }

    public Payroll amount(Float amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Payroll)) {
            return false;
        }
        return id != null && id.equals(((Payroll) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Payroll{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", paymonth=" + getPaymonth() +
            ", amount=" + getAmount() +
            "}";
    }
}

package com.cenfotec.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Schedule.
 */
@Entity
@Table(name = "schedule")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Schedule implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "i_d_schedule", nullable = false, unique = true)
    private Integer iDSchedule;

    @Column(name = "in_date_time")
    private ZonedDateTime inDateTime;

    @Column(name = "out_date_time")
    private ZonedDateTime outDateTime;

    @ManyToOne
    @JsonIgnoreProperties(
        value = {
            "idUserUserInterface",
            "idUserPayments",
            "idUserGuests",
            "idUserSchedules",
            "idUserCondos",
            "idUserReservations",
            "idUserAdminWalls",
            "idUserGeneralForums",
        },
        allowSetters = true
    )
    private UserProfile userProfile;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Schedule id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getiDSchedule() {
        return this.iDSchedule;
    }

    public Schedule iDSchedule(Integer iDSchedule) {
        this.iDSchedule = iDSchedule;
        return this;
    }

    public void setiDSchedule(Integer iDSchedule) {
        this.iDSchedule = iDSchedule;
    }

    public ZonedDateTime getInDateTime() {
        return this.inDateTime;
    }

    public Schedule inDateTime(ZonedDateTime inDateTime) {
        this.inDateTime = inDateTime;
        return this;
    }

    public void setInDateTime(ZonedDateTime inDateTime) {
        this.inDateTime = inDateTime;
    }

    public ZonedDateTime getOutDateTime() {
        return this.outDateTime;
    }

    public Schedule outDateTime(ZonedDateTime outDateTime) {
        this.outDateTime = outDateTime;
        return this;
    }

    public void setOutDateTime(ZonedDateTime outDateTime) {
        this.outDateTime = outDateTime;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public Schedule userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Schedule)) {
            return false;
        }
        return id != null && id.equals(((Schedule) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Schedule{" +
            "id=" + getId() +
            ", iDSchedule=" + getiDSchedule() +
            ", inDateTime='" + getInDateTime() + "'" +
            ", outDateTime='" + getOutDateTime() + "'" +
            "}";
    }
}

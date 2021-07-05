package com.cenfotec.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CheckLog.
 */
@Entity
@Table(name = "check_log")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CheckLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "i_d_check_log", nullable = false, unique = true)
    private Integer iDCheckLog;

    @Column(name = "in_date_time")
    private ZonedDateTime inDateTime;

    @Column(name = "out_date_time")
    private ZonedDateTime outDateTime;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_check_log__idcheck_log_guest",
        joinColumns = @JoinColumn(name = "check_log_id"),
        inverseJoinColumns = @JoinColumn(name = "idcheck_log_guest_id")
    )
    @JsonIgnoreProperties(value = { "userProfile", "iDGuestCheckLogs" }, allowSetters = true)
    private Set<Guest> iDCheckLogGuests = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CheckLog id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getiDCheckLog() {
        return this.iDCheckLog;
    }

    public CheckLog iDCheckLog(Integer iDCheckLog) {
        this.iDCheckLog = iDCheckLog;
        return this;
    }

    public void setiDCheckLog(Integer iDCheckLog) {
        this.iDCheckLog = iDCheckLog;
    }

    public ZonedDateTime getInDateTime() {
        return this.inDateTime;
    }

    public CheckLog inDateTime(ZonedDateTime inDateTime) {
        this.inDateTime = inDateTime;
        return this;
    }

    public void setInDateTime(ZonedDateTime inDateTime) {
        this.inDateTime = inDateTime;
    }

    public ZonedDateTime getOutDateTime() {
        return this.outDateTime;
    }

    public CheckLog outDateTime(ZonedDateTime outDateTime) {
        this.outDateTime = outDateTime;
        return this;
    }

    public void setOutDateTime(ZonedDateTime outDateTime) {
        this.outDateTime = outDateTime;
    }

    public Set<Guest> getIDCheckLogGuests() {
        return this.iDCheckLogGuests;
    }

    public CheckLog iDCheckLogGuests(Set<Guest> guests) {
        this.setIDCheckLogGuests(guests);
        return this;
    }

    public CheckLog addIDCheckLogGuest(Guest guest) {
        this.iDCheckLogGuests.add(guest);
        guest.getIDGuestCheckLogs().add(this);
        return this;
    }

    public CheckLog removeIDCheckLogGuest(Guest guest) {
        this.iDCheckLogGuests.remove(guest);
        guest.getIDGuestCheckLogs().remove(this);
        return this;
    }

    public void setIDCheckLogGuests(Set<Guest> guests) {
        this.iDCheckLogGuests = guests;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CheckLog)) {
            return false;
        }
        return id != null && id.equals(((CheckLog) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CheckLog{" +
            "id=" + getId() +
            ", iDCheckLog=" + getiDCheckLog() +
            ", inDateTime='" + getInDateTime() + "'" +
            ", outDateTime='" + getOutDateTime() + "'" +
            "}";
    }
}

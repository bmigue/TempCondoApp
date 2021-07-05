package com.cenfotec.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Guest.
 */
@Entity
@Table(name = "guest")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Guest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "i_d_guest", nullable = false, unique = true)
    private Integer iDGuest;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "plate_number")
    private String plateNumber;

    @Column(name = "status")
    private String status;

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

    @ManyToMany(mappedBy = "iDCheckLogGuests")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "iDCheckLogGuests" }, allowSetters = true)
    private Set<CheckLog> iDGuestCheckLogs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Guest id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getiDGuest() {
        return this.iDGuest;
    }

    public Guest iDGuest(Integer iDGuest) {
        this.iDGuest = iDGuest;
        return this;
    }

    public void setiDGuest(Integer iDGuest) {
        this.iDGuest = iDGuest;
    }

    public String getFullName() {
        return this.fullName;
    }

    public Guest fullName(String fullName) {
        this.fullName = fullName;
        return this;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPlateNumber() {
        return this.plateNumber;
    }

    public Guest plateNumber(String plateNumber) {
        this.plateNumber = plateNumber;
        return this;
    }

    public void setPlateNumber(String plateNumber) {
        this.plateNumber = plateNumber;
    }

    public String getStatus() {
        return this.status;
    }

    public Guest status(String status) {
        this.status = status;
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public Guest userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public Set<CheckLog> getIDGuestCheckLogs() {
        return this.iDGuestCheckLogs;
    }

    public Guest iDGuestCheckLogs(Set<CheckLog> checkLogs) {
        this.setIDGuestCheckLogs(checkLogs);
        return this;
    }

    public Guest addIDGuestCheckLog(CheckLog checkLog) {
        this.iDGuestCheckLogs.add(checkLog);
        checkLog.getIDCheckLogGuests().add(this);
        return this;
    }

    public Guest removeIDGuestCheckLog(CheckLog checkLog) {
        this.iDGuestCheckLogs.remove(checkLog);
        checkLog.getIDCheckLogGuests().remove(this);
        return this;
    }

    public void setIDGuestCheckLogs(Set<CheckLog> checkLogs) {
        if (this.iDGuestCheckLogs != null) {
            this.iDGuestCheckLogs.forEach(i -> i.removeIDCheckLogGuest(this));
        }
        if (checkLogs != null) {
            checkLogs.forEach(i -> i.addIDCheckLogGuest(this));
        }
        this.iDGuestCheckLogs = checkLogs;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Guest)) {
            return false;
        }
        return id != null && id.equals(((Guest) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Guest{" +
            "id=" + getId() +
            ", iDGuest=" + getiDGuest() +
            ", fullName='" + getFullName() + "'" +
            ", plateNumber='" + getPlateNumber() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}

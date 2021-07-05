package com.cenfotec.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Reservation.
 */
@Entity
@Table(name = "reservation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Reservation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "i_d_reservation", nullable = false, unique = true)
    private Integer iDReservation;

    @Column(name = "res_date_time")
    private ZonedDateTime resDateTime;

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

    @ManyToOne
    @JsonIgnoreProperties(value = { "iDCommonAreaMedia", "iDCommonAreaReservations", "condo" }, allowSetters = true)
    private CommonArea commonArea;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Reservation id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getiDReservation() {
        return this.iDReservation;
    }

    public Reservation iDReservation(Integer iDReservation) {
        this.iDReservation = iDReservation;
        return this;
    }

    public void setiDReservation(Integer iDReservation) {
        this.iDReservation = iDReservation;
    }

    public ZonedDateTime getResDateTime() {
        return this.resDateTime;
    }

    public Reservation resDateTime(ZonedDateTime resDateTime) {
        this.resDateTime = resDateTime;
        return this;
    }

    public void setResDateTime(ZonedDateTime resDateTime) {
        this.resDateTime = resDateTime;
    }

    public String getStatus() {
        return this.status;
    }

    public Reservation status(String status) {
        this.status = status;
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public Reservation userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public CommonArea getCommonArea() {
        return this.commonArea;
    }

    public Reservation commonArea(CommonArea commonArea) {
        this.setCommonArea(commonArea);
        return this;
    }

    public void setCommonArea(CommonArea commonArea) {
        this.commonArea = commonArea;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Reservation)) {
            return false;
        }
        return id != null && id.equals(((Reservation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Reservation{" +
            "id=" + getId() +
            ", iDReservation=" + getiDReservation() +
            ", resDateTime='" + getResDateTime() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}

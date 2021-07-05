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
 * A UserProfile.
 */
@Entity
@Table(name = "user_profile")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserProfile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "i_d_user", nullable = false, unique = true)
    private Integer iDUser;

    @Column(name = "name")
    private String name;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "plate_number")
    private String plateNumber;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "type")
    private String type;

    @OneToOne
    @JoinColumn(unique = true)
    private UserInterface idUserUserInterface;

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile" }, allowSetters = true)
    private Set<PaymentLog> idUserPayments = new HashSet<>();

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile", "iDGuestCheckLogs" }, allowSetters = true)
    private Set<Guest> idUserGuests = new HashSet<>();

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile" }, allowSetters = true)
    private Set<Schedule> idUserSchedules = new HashSet<>();

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "iDCondoCommonAreas", "userProfile" }, allowSetters = true)
    private Set<Condo> idUserCondos = new HashSet<>();

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile", "commonArea" }, allowSetters = true)
    private Set<Reservation> idUserReservations = new HashSet<>();

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "iDAdminWallComments", "userProfile" }, allowSetters = true)
    private Set<AdminWall> idUserAdminWalls = new HashSet<>();

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "iDGeneralForumComments", "userProfile" }, allowSetters = true)
    private Set<GeneralForum> idUserGeneralForums = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserProfile id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getiDUser() {
        return this.iDUser;
    }

    public UserProfile iDUser(Integer iDUser) {
        this.iDUser = iDUser;
        return this;
    }

    public void setiDUser(Integer iDUser) {
        this.iDUser = iDUser;
    }

    public String getName() {
        return this.name;
    }

    public UserProfile name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return this.lastName;
    }

    public UserProfile lastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public UserProfile email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public UserProfile phoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPlateNumber() {
        return this.plateNumber;
    }

    public UserProfile plateNumber(String plateNumber) {
        this.plateNumber = plateNumber;
        return this;
    }

    public void setPlateNumber(String plateNumber) {
        this.plateNumber = plateNumber;
    }

    public Boolean getStatus() {
        return this.status;
    }

    public UserProfile status(Boolean status) {
        this.status = status;
        return this;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getType() {
        return this.type;
    }

    public UserProfile type(String type) {
        this.type = type;
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public UserInterface getIdUserUserInterface() {
        return this.idUserUserInterface;
    }

    public UserProfile idUserUserInterface(UserInterface userInterface) {
        this.setIdUserUserInterface(userInterface);
        return this;
    }

    public void setIdUserUserInterface(UserInterface userInterface) {
        this.idUserUserInterface = userInterface;
    }

    public Set<PaymentLog> getIdUserPayments() {
        return this.idUserPayments;
    }

    public UserProfile idUserPayments(Set<PaymentLog> paymentLogs) {
        this.setIdUserPayments(paymentLogs);
        return this;
    }

    public UserProfile addIdUserPayment(PaymentLog paymentLog) {
        this.idUserPayments.add(paymentLog);
        paymentLog.setUserProfile(this);
        return this;
    }

    public UserProfile removeIdUserPayment(PaymentLog paymentLog) {
        this.idUserPayments.remove(paymentLog);
        paymentLog.setUserProfile(null);
        return this;
    }

    public void setIdUserPayments(Set<PaymentLog> paymentLogs) {
        if (this.idUserPayments != null) {
            this.idUserPayments.forEach(i -> i.setUserProfile(null));
        }
        if (paymentLogs != null) {
            paymentLogs.forEach(i -> i.setUserProfile(this));
        }
        this.idUserPayments = paymentLogs;
    }

    public Set<Guest> getIdUserGuests() {
        return this.idUserGuests;
    }

    public UserProfile idUserGuests(Set<Guest> guests) {
        this.setIdUserGuests(guests);
        return this;
    }

    public UserProfile addIdUserGuest(Guest guest) {
        this.idUserGuests.add(guest);
        guest.setUserProfile(this);
        return this;
    }

    public UserProfile removeIdUserGuest(Guest guest) {
        this.idUserGuests.remove(guest);
        guest.setUserProfile(null);
        return this;
    }

    public void setIdUserGuests(Set<Guest> guests) {
        if (this.idUserGuests != null) {
            this.idUserGuests.forEach(i -> i.setUserProfile(null));
        }
        if (guests != null) {
            guests.forEach(i -> i.setUserProfile(this));
        }
        this.idUserGuests = guests;
    }

    public Set<Schedule> getIdUserSchedules() {
        return this.idUserSchedules;
    }

    public UserProfile idUserSchedules(Set<Schedule> schedules) {
        this.setIdUserSchedules(schedules);
        return this;
    }

    public UserProfile addIdUserSchedule(Schedule schedule) {
        this.idUserSchedules.add(schedule);
        schedule.setUserProfile(this);
        return this;
    }

    public UserProfile removeIdUserSchedule(Schedule schedule) {
        this.idUserSchedules.remove(schedule);
        schedule.setUserProfile(null);
        return this;
    }

    public void setIdUserSchedules(Set<Schedule> schedules) {
        if (this.idUserSchedules != null) {
            this.idUserSchedules.forEach(i -> i.setUserProfile(null));
        }
        if (schedules != null) {
            schedules.forEach(i -> i.setUserProfile(this));
        }
        this.idUserSchedules = schedules;
    }

    public Set<Condo> getIdUserCondos() {
        return this.idUserCondos;
    }

    public UserProfile idUserCondos(Set<Condo> condos) {
        this.setIdUserCondos(condos);
        return this;
    }

    public UserProfile addIdUserCondo(Condo condo) {
        this.idUserCondos.add(condo);
        condo.setUserProfile(this);
        return this;
    }

    public UserProfile removeIdUserCondo(Condo condo) {
        this.idUserCondos.remove(condo);
        condo.setUserProfile(null);
        return this;
    }

    public void setIdUserCondos(Set<Condo> condos) {
        if (this.idUserCondos != null) {
            this.idUserCondos.forEach(i -> i.setUserProfile(null));
        }
        if (condos != null) {
            condos.forEach(i -> i.setUserProfile(this));
        }
        this.idUserCondos = condos;
    }

    public Set<Reservation> getIdUserReservations() {
        return this.idUserReservations;
    }

    public UserProfile idUserReservations(Set<Reservation> reservations) {
        this.setIdUserReservations(reservations);
        return this;
    }

    public UserProfile addIdUserReservation(Reservation reservation) {
        this.idUserReservations.add(reservation);
        reservation.setUserProfile(this);
        return this;
    }

    public UserProfile removeIdUserReservation(Reservation reservation) {
        this.idUserReservations.remove(reservation);
        reservation.setUserProfile(null);
        return this;
    }

    public void setIdUserReservations(Set<Reservation> reservations) {
        if (this.idUserReservations != null) {
            this.idUserReservations.forEach(i -> i.setUserProfile(null));
        }
        if (reservations != null) {
            reservations.forEach(i -> i.setUserProfile(this));
        }
        this.idUserReservations = reservations;
    }

    public Set<AdminWall> getIdUserAdminWalls() {
        return this.idUserAdminWalls;
    }

    public UserProfile idUserAdminWalls(Set<AdminWall> adminWalls) {
        this.setIdUserAdminWalls(adminWalls);
        return this;
    }

    public UserProfile addIdUserAdminWall(AdminWall adminWall) {
        this.idUserAdminWalls.add(adminWall);
        adminWall.setUserProfile(this);
        return this;
    }

    public UserProfile removeIdUserAdminWall(AdminWall adminWall) {
        this.idUserAdminWalls.remove(adminWall);
        adminWall.setUserProfile(null);
        return this;
    }

    public void setIdUserAdminWalls(Set<AdminWall> adminWalls) {
        if (this.idUserAdminWalls != null) {
            this.idUserAdminWalls.forEach(i -> i.setUserProfile(null));
        }
        if (adminWalls != null) {
            adminWalls.forEach(i -> i.setUserProfile(this));
        }
        this.idUserAdminWalls = adminWalls;
    }

    public Set<GeneralForum> getIdUserGeneralForums() {
        return this.idUserGeneralForums;
    }

    public UserProfile idUserGeneralForums(Set<GeneralForum> generalForums) {
        this.setIdUserGeneralForums(generalForums);
        return this;
    }

    public UserProfile addIdUserGeneralForum(GeneralForum generalForum) {
        this.idUserGeneralForums.add(generalForum);
        generalForum.setUserProfile(this);
        return this;
    }

    public UserProfile removeIdUserGeneralForum(GeneralForum generalForum) {
        this.idUserGeneralForums.remove(generalForum);
        generalForum.setUserProfile(null);
        return this;
    }

    public void setIdUserGeneralForums(Set<GeneralForum> generalForums) {
        if (this.idUserGeneralForums != null) {
            this.idUserGeneralForums.forEach(i -> i.setUserProfile(null));
        }
        if (generalForums != null) {
            generalForums.forEach(i -> i.setUserProfile(this));
        }
        this.idUserGeneralForums = generalForums;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserProfile)) {
            return false;
        }
        return id != null && id.equals(((UserProfile) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserProfile{" +
            "id=" + getId() +
            ", iDUser=" + getiDUser() +
            ", name='" + getName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", email='" + getEmail() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", plateNumber='" + getPlateNumber() + "'" +
            ", status='" + getStatus() + "'" +
            ", type='" + getType() + "'" +
            "}";
    }
}

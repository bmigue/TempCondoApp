package com.cenfotec.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PaymentLog.
 */
@Entity
@Table(name = "payment_log")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PaymentLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "i_d_payment_log", nullable = false, unique = true)
    private Integer iDPaymentLog;

    @Column(name = "due_date")
    private LocalDate dueDate;

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

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PaymentLog id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getiDPaymentLog() {
        return this.iDPaymentLog;
    }

    public PaymentLog iDPaymentLog(Integer iDPaymentLog) {
        this.iDPaymentLog = iDPaymentLog;
        return this;
    }

    public void setiDPaymentLog(Integer iDPaymentLog) {
        this.iDPaymentLog = iDPaymentLog;
    }

    public LocalDate getDueDate() {
        return this.dueDate;
    }

    public PaymentLog dueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
        return this;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getStatus() {
        return this.status;
    }

    public PaymentLog status(String status) {
        this.status = status;
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public PaymentLog userProfile(UserProfile userProfile) {
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
        if (!(o instanceof PaymentLog)) {
            return false;
        }
        return id != null && id.equals(((PaymentLog) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PaymentLog{" +
            "id=" + getId() +
            ", iDPaymentLog=" + getiDPaymentLog() +
            ", dueDate='" + getDueDate() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}

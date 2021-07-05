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
 * A CommonArea.
 */
@Entity
@Table(name = "common_area")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CommonArea implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "i_d_common_area", nullable = false, unique = true)
    private Integer iDCommonArea;

    @Column(name = "status")
    private String status;

    @Column(name = "name")
    private String name;

    @OneToOne
    @JoinColumn(unique = true)
    private Media iDCommonAreaMedia;

    @OneToMany(mappedBy = "commonArea")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile", "commonArea" }, allowSetters = true)
    private Set<Reservation> iDCommonAreaReservations = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "iDCondoCommonAreas", "userProfile" }, allowSetters = true)
    private Condo condo;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CommonArea id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getiDCommonArea() {
        return this.iDCommonArea;
    }

    public CommonArea iDCommonArea(Integer iDCommonArea) {
        this.iDCommonArea = iDCommonArea;
        return this;
    }

    public void setiDCommonArea(Integer iDCommonArea) {
        this.iDCommonArea = iDCommonArea;
    }

    public String getStatus() {
        return this.status;
    }

    public CommonArea status(String status) {
        this.status = status;
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getName() {
        return this.name;
    }

    public CommonArea name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Media getIDCommonAreaMedia() {
        return this.iDCommonAreaMedia;
    }

    public CommonArea iDCommonAreaMedia(Media media) {
        this.setIDCommonAreaMedia(media);
        return this;
    }

    public void setIDCommonAreaMedia(Media media) {
        this.iDCommonAreaMedia = media;
    }

    public Set<Reservation> getIDCommonAreaReservations() {
        return this.iDCommonAreaReservations;
    }

    public CommonArea iDCommonAreaReservations(Set<Reservation> reservations) {
        this.setIDCommonAreaReservations(reservations);
        return this;
    }

    public CommonArea addIDCommonAreaReservation(Reservation reservation) {
        this.iDCommonAreaReservations.add(reservation);
        reservation.setCommonArea(this);
        return this;
    }

    public CommonArea removeIDCommonAreaReservation(Reservation reservation) {
        this.iDCommonAreaReservations.remove(reservation);
        reservation.setCommonArea(null);
        return this;
    }

    public void setIDCommonAreaReservations(Set<Reservation> reservations) {
        if (this.iDCommonAreaReservations != null) {
            this.iDCommonAreaReservations.forEach(i -> i.setCommonArea(null));
        }
        if (reservations != null) {
            reservations.forEach(i -> i.setCommonArea(this));
        }
        this.iDCommonAreaReservations = reservations;
    }

    public Condo getCondo() {
        return this.condo;
    }

    public CommonArea condo(Condo condo) {
        this.setCondo(condo);
        return this;
    }

    public void setCondo(Condo condo) {
        this.condo = condo;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CommonArea)) {
            return false;
        }
        return id != null && id.equals(((CommonArea) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CommonArea{" +
            "id=" + getId() +
            ", iDCommonArea=" + getiDCommonArea() +
            ", status='" + getStatus() + "'" +
            ", name='" + getName() + "'" +
            "}";
    }
}

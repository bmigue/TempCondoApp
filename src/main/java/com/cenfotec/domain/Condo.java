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
 * A Condo.
 */
@Entity
@Table(name = "condo")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Condo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "i_d_condo", nullable = false, unique = true)
    private Integer iDCondo;

    @Column(name = "nombre")
    private String nombre;

    @OneToMany(mappedBy = "condo")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "iDCommonAreaMedia", "iDCommonAreaReservations", "condo" }, allowSetters = true)
    private Set<CommonArea> iDCondoCommonAreas = new HashSet<>();

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

    public Condo id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getiDCondo() {
        return this.iDCondo;
    }

    public Condo iDCondo(Integer iDCondo) {
        this.iDCondo = iDCondo;
        return this;
    }

    public void setiDCondo(Integer iDCondo) {
        this.iDCondo = iDCondo;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Condo nombre(String nombre) {
        this.nombre = nombre;
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Set<CommonArea> getIDCondoCommonAreas() {
        return this.iDCondoCommonAreas;
    }

    public Condo iDCondoCommonAreas(Set<CommonArea> commonAreas) {
        this.setIDCondoCommonAreas(commonAreas);
        return this;
    }

    public Condo addIDCondoCommonArea(CommonArea commonArea) {
        this.iDCondoCommonAreas.add(commonArea);
        commonArea.setCondo(this);
        return this;
    }

    public Condo removeIDCondoCommonArea(CommonArea commonArea) {
        this.iDCondoCommonAreas.remove(commonArea);
        commonArea.setCondo(null);
        return this;
    }

    public void setIDCondoCommonAreas(Set<CommonArea> commonAreas) {
        if (this.iDCondoCommonAreas != null) {
            this.iDCondoCommonAreas.forEach(i -> i.setCondo(null));
        }
        if (commonAreas != null) {
            commonAreas.forEach(i -> i.setCondo(this));
        }
        this.iDCondoCommonAreas = commonAreas;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public Condo userProfile(UserProfile userProfile) {
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
        if (!(o instanceof Condo)) {
            return false;
        }
        return id != null && id.equals(((Condo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Condo{" +
            "id=" + getId() +
            ", iDCondo=" + getiDCondo() +
            ", nombre='" + getNombre() + "'" +
            "}";
    }
}

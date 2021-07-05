package com.cenfotec.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Property.
 */
@Entity
@Table(name = "property")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Property implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "i_d_property", nullable = false, unique = true)
    private Integer iDProperty;

    @Column(name = "type")
    private String type;

    @Column(name = "description")
    private String description;

    @Column(name = "has_house_built")
    private Boolean hasHouseBuilt;

    @Column(name = "property_size")
    private Long propertySize;

    @OneToOne
    @JoinColumn(unique = true)
    private Media iDPropertyMedia;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Property id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getiDProperty() {
        return this.iDProperty;
    }

    public Property iDProperty(Integer iDProperty) {
        this.iDProperty = iDProperty;
        return this;
    }

    public void setiDProperty(Integer iDProperty) {
        this.iDProperty = iDProperty;
    }

    public String getType() {
        return this.type;
    }

    public Property type(String type) {
        this.type = type;
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return this.description;
    }

    public Property description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getHasHouseBuilt() {
        return this.hasHouseBuilt;
    }

    public Property hasHouseBuilt(Boolean hasHouseBuilt) {
        this.hasHouseBuilt = hasHouseBuilt;
        return this;
    }

    public void setHasHouseBuilt(Boolean hasHouseBuilt) {
        this.hasHouseBuilt = hasHouseBuilt;
    }

    public Long getPropertySize() {
        return this.propertySize;
    }

    public Property propertySize(Long propertySize) {
        this.propertySize = propertySize;
        return this;
    }

    public void setPropertySize(Long propertySize) {
        this.propertySize = propertySize;
    }

    public Media getIDPropertyMedia() {
        return this.iDPropertyMedia;
    }

    public Property iDPropertyMedia(Media media) {
        this.setIDPropertyMedia(media);
        return this;
    }

    public void setIDPropertyMedia(Media media) {
        this.iDPropertyMedia = media;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Property)) {
            return false;
        }
        return id != null && id.equals(((Property) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Property{" +
            "id=" + getId() +
            ", iDProperty=" + getiDProperty() +
            ", type='" + getType() + "'" +
            ", description='" + getDescription() + "'" +
            ", hasHouseBuilt='" + getHasHouseBuilt() + "'" +
            ", propertySize=" + getPropertySize() +
            "}";
    }
}

package com.cenfotec.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserInterface.
 */
@Entity
@Table(name = "user_interface")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserInterface implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "i_d_user_interface", nullable = false, unique = true)
    private Integer iDUserInterface;

    @Column(name = "theme_name")
    private String themeName;

    @Column(name = "color")
    private String color;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserInterface id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getiDUserInterface() {
        return this.iDUserInterface;
    }

    public UserInterface iDUserInterface(Integer iDUserInterface) {
        this.iDUserInterface = iDUserInterface;
        return this;
    }

    public void setiDUserInterface(Integer iDUserInterface) {
        this.iDUserInterface = iDUserInterface;
    }

    public String getThemeName() {
        return this.themeName;
    }

    public UserInterface themeName(String themeName) {
        this.themeName = themeName;
        return this;
    }

    public void setThemeName(String themeName) {
        this.themeName = themeName;
    }

    public String getColor() {
        return this.color;
    }

    public UserInterface color(String color) {
        this.color = color;
        return this;
    }

    public void setColor(String color) {
        this.color = color;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserInterface)) {
            return false;
        }
        return id != null && id.equals(((UserInterface) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserInterface{" +
            "id=" + getId() +
            ", iDUserInterface=" + getiDUserInterface() +
            ", themeName='" + getThemeName() + "'" +
            ", color='" + getColor() + "'" +
            "}";
    }
}

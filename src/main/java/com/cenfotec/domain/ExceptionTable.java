package com.cenfotec.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ExceptionTable.
 */
@Entity
@Table(name = "exception_table")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ExceptionTable implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "i_d_exception", nullable = false, unique = true)
    private Integer iDException;

    @Column(name = "message")
    private String message;

    @Column(name = "number")
    private Integer number;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ExceptionTable id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getiDException() {
        return this.iDException;
    }

    public ExceptionTable iDException(Integer iDException) {
        this.iDException = iDException;
        return this;
    }

    public void setiDException(Integer iDException) {
        this.iDException = iDException;
    }

    public String getMessage() {
        return this.message;
    }

    public ExceptionTable message(String message) {
        this.message = message;
        return this;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getNumber() {
        return this.number;
    }

    public ExceptionTable number(Integer number) {
        this.number = number;
        return this;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ExceptionTable)) {
            return false;
        }
        return id != null && id.equals(((ExceptionTable) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ExceptionTable{" +
            "id=" + getId() +
            ", iDException=" + getiDException() +
            ", message='" + getMessage() + "'" +
            ", number=" + getNumber() +
            "}";
    }
}

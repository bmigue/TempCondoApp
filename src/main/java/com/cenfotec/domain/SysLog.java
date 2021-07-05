package com.cenfotec.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SysLog.
 */
@Entity
@Table(name = "sys_log")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SysLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "i_d_sys_log", nullable = false, unique = true)
    private Integer iDSysLog;

    @Column(name = "log_date_time")
    private ZonedDateTime logDateTime;

    @Column(name = "action")
    private String action;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SysLog id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getiDSysLog() {
        return this.iDSysLog;
    }

    public SysLog iDSysLog(Integer iDSysLog) {
        this.iDSysLog = iDSysLog;
        return this;
    }

    public void setiDSysLog(Integer iDSysLog) {
        this.iDSysLog = iDSysLog;
    }

    public ZonedDateTime getLogDateTime() {
        return this.logDateTime;
    }

    public SysLog logDateTime(ZonedDateTime logDateTime) {
        this.logDateTime = logDateTime;
        return this;
    }

    public void setLogDateTime(ZonedDateTime logDateTime) {
        this.logDateTime = logDateTime;
    }

    public String getAction() {
        return this.action;
    }

    public SysLog action(String action) {
        this.action = action;
        return this;
    }

    public void setAction(String action) {
        this.action = action;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SysLog)) {
            return false;
        }
        return id != null && id.equals(((SysLog) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SysLog{" +
            "id=" + getId() +
            ", iDSysLog=" + getiDSysLog() +
            ", logDateTime='" + getLogDateTime() + "'" +
            ", action='" + getAction() + "'" +
            "}";
    }
}

package com.cenfotec.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Comment.
 */
@Entity
@Table(name = "comment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Comment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "i_d_comment", nullable = false, unique = true)
    private Integer iDComment;

    @Column(name = "post_date")
    private ZonedDateTime postDate;

    @Column(name = "comment")
    private String comment;

    @ManyToOne
    @JsonIgnoreProperties(value = { "iDAdminWallComments", "userProfile" }, allowSetters = true)
    private AdminWall adminWall;

    @ManyToOne
    @JsonIgnoreProperties(value = { "iDGeneralForumComments", "userProfile" }, allowSetters = true)
    private GeneralForum generalForum;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Comment id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getiDComment() {
        return this.iDComment;
    }

    public Comment iDComment(Integer iDComment) {
        this.iDComment = iDComment;
        return this;
    }

    public void setiDComment(Integer iDComment) {
        this.iDComment = iDComment;
    }

    public ZonedDateTime getPostDate() {
        return this.postDate;
    }

    public Comment postDate(ZonedDateTime postDate) {
        this.postDate = postDate;
        return this;
    }

    public void setPostDate(ZonedDateTime postDate) {
        this.postDate = postDate;
    }

    public String getComment() {
        return this.comment;
    }

    public Comment comment(String comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public AdminWall getAdminWall() {
        return this.adminWall;
    }

    public Comment adminWall(AdminWall adminWall) {
        this.setAdminWall(adminWall);
        return this;
    }

    public void setAdminWall(AdminWall adminWall) {
        this.adminWall = adminWall;
    }

    public GeneralForum getGeneralForum() {
        return this.generalForum;
    }

    public Comment generalForum(GeneralForum generalForum) {
        this.setGeneralForum(generalForum);
        return this;
    }

    public void setGeneralForum(GeneralForum generalForum) {
        this.generalForum = generalForum;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Comment)) {
            return false;
        }
        return id != null && id.equals(((Comment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Comment{" +
            "id=" + getId() +
            ", iDComment=" + getiDComment() +
            ", postDate='" + getPostDate() + "'" +
            ", comment='" + getComment() + "'" +
            "}";
    }
}

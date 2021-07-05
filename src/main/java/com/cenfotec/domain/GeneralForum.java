package com.cenfotec.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A GeneralForum.
 */
@Entity
@Table(name = "general_forum")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class GeneralForum implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "i_d_general_forum", nullable = false, unique = true)
    private Integer iDGeneralForum;

    @Column(name = "post_date")
    private ZonedDateTime postDate;

    @Column(name = "post")
    private String post;

    @OneToMany(mappedBy = "generalForum")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "adminWall", "generalForum" }, allowSetters = true)
    private Set<Comment> iDGeneralForumComments = new HashSet<>();

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

    public GeneralForum id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getiDGeneralForum() {
        return this.iDGeneralForum;
    }

    public GeneralForum iDGeneralForum(Integer iDGeneralForum) {
        this.iDGeneralForum = iDGeneralForum;
        return this;
    }

    public void setiDGeneralForum(Integer iDGeneralForum) {
        this.iDGeneralForum = iDGeneralForum;
    }

    public ZonedDateTime getPostDate() {
        return this.postDate;
    }

    public GeneralForum postDate(ZonedDateTime postDate) {
        this.postDate = postDate;
        return this;
    }

    public void setPostDate(ZonedDateTime postDate) {
        this.postDate = postDate;
    }

    public String getPost() {
        return this.post;
    }

    public GeneralForum post(String post) {
        this.post = post;
        return this;
    }

    public void setPost(String post) {
        this.post = post;
    }

    public Set<Comment> getIDGeneralForumComments() {
        return this.iDGeneralForumComments;
    }

    public GeneralForum iDGeneralForumComments(Set<Comment> comments) {
        this.setIDGeneralForumComments(comments);
        return this;
    }

    public GeneralForum addIDGeneralForumComment(Comment comment) {
        this.iDGeneralForumComments.add(comment);
        comment.setGeneralForum(this);
        return this;
    }

    public GeneralForum removeIDGeneralForumComment(Comment comment) {
        this.iDGeneralForumComments.remove(comment);
        comment.setGeneralForum(null);
        return this;
    }

    public void setIDGeneralForumComments(Set<Comment> comments) {
        if (this.iDGeneralForumComments != null) {
            this.iDGeneralForumComments.forEach(i -> i.setGeneralForum(null));
        }
        if (comments != null) {
            comments.forEach(i -> i.setGeneralForum(this));
        }
        this.iDGeneralForumComments = comments;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public GeneralForum userProfile(UserProfile userProfile) {
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
        if (!(o instanceof GeneralForum)) {
            return false;
        }
        return id != null && id.equals(((GeneralForum) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GeneralForum{" +
            "id=" + getId() +
            ", iDGeneralForum=" + getiDGeneralForum() +
            ", postDate='" + getPostDate() + "'" +
            ", post='" + getPost() + "'" +
            "}";
    }
}

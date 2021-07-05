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
 * A AdminWall.
 */
@Entity
@Table(name = "admin_wall")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AdminWall implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "i_d_admin_wall", nullable = false, unique = true)
    private Integer iDAdminWall;

    @Column(name = "post_date")
    private ZonedDateTime postDate;

    @Column(name = "post")
    private String post;

    @OneToMany(mappedBy = "adminWall")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "adminWall", "generalForum" }, allowSetters = true)
    private Set<Comment> iDAdminWallComments = new HashSet<>();

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

    public AdminWall id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getiDAdminWall() {
        return this.iDAdminWall;
    }

    public AdminWall iDAdminWall(Integer iDAdminWall) {
        this.iDAdminWall = iDAdminWall;
        return this;
    }

    public void setiDAdminWall(Integer iDAdminWall) {
        this.iDAdminWall = iDAdminWall;
    }

    public ZonedDateTime getPostDate() {
        return this.postDate;
    }

    public AdminWall postDate(ZonedDateTime postDate) {
        this.postDate = postDate;
        return this;
    }

    public void setPostDate(ZonedDateTime postDate) {
        this.postDate = postDate;
    }

    public String getPost() {
        return this.post;
    }

    public AdminWall post(String post) {
        this.post = post;
        return this;
    }

    public void setPost(String post) {
        this.post = post;
    }

    public Set<Comment> getIDAdminWallComments() {
        return this.iDAdminWallComments;
    }

    public AdminWall iDAdminWallComments(Set<Comment> comments) {
        this.setIDAdminWallComments(comments);
        return this;
    }

    public AdminWall addIDAdminWallComment(Comment comment) {
        this.iDAdminWallComments.add(comment);
        comment.setAdminWall(this);
        return this;
    }

    public AdminWall removeIDAdminWallComment(Comment comment) {
        this.iDAdminWallComments.remove(comment);
        comment.setAdminWall(null);
        return this;
    }

    public void setIDAdminWallComments(Set<Comment> comments) {
        if (this.iDAdminWallComments != null) {
            this.iDAdminWallComments.forEach(i -> i.setAdminWall(null));
        }
        if (comments != null) {
            comments.forEach(i -> i.setAdminWall(this));
        }
        this.iDAdminWallComments = comments;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public AdminWall userProfile(UserProfile userProfile) {
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
        if (!(o instanceof AdminWall)) {
            return false;
        }
        return id != null && id.equals(((AdminWall) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AdminWall{" +
            "id=" + getId() +
            ", iDAdminWall=" + getiDAdminWall() +
            ", postDate='" + getPostDate() + "'" +
            ", post='" + getPost() + "'" +
            "}";
    }
}

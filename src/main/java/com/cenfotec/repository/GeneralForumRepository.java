package com.cenfotec.repository;

import com.cenfotec.domain.GeneralForum;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the GeneralForum entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GeneralForumRepository extends JpaRepository<GeneralForum, Long> {}

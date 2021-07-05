package com.cenfotec.repository;

import com.cenfotec.domain.AdminWall;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AdminWall entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AdminWallRepository extends JpaRepository<AdminWall, Long> {}

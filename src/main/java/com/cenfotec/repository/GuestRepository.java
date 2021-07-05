package com.cenfotec.repository;

import com.cenfotec.domain.Guest;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Guest entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {}

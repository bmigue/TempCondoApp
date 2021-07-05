package com.cenfotec.repository;

import com.cenfotec.domain.Condo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Condo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CondoRepository extends JpaRepository<Condo, Long> {}

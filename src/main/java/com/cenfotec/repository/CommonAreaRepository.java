package com.cenfotec.repository;

import com.cenfotec.domain.CommonArea;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the CommonArea entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CommonAreaRepository extends JpaRepository<CommonArea, Long> {}

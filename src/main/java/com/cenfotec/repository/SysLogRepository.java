package com.cenfotec.repository;

import com.cenfotec.domain.SysLog;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SysLog entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SysLogRepository extends JpaRepository<SysLog, Long> {}

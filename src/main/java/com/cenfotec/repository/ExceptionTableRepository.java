package com.cenfotec.repository;

import com.cenfotec.domain.ExceptionTable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ExceptionTable entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExceptionTableRepository extends JpaRepository<ExceptionTable, Long> {}

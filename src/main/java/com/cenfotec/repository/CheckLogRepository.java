package com.cenfotec.repository;

import com.cenfotec.domain.CheckLog;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the CheckLog entity.
 */
@Repository
public interface CheckLogRepository extends JpaRepository<CheckLog, Long> {
    @Query(
        value = "select distinct checkLog from CheckLog checkLog left join fetch checkLog.iDCheckLogGuests",
        countQuery = "select count(distinct checkLog) from CheckLog checkLog"
    )
    Page<CheckLog> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct checkLog from CheckLog checkLog left join fetch checkLog.iDCheckLogGuests")
    List<CheckLog> findAllWithEagerRelationships();

    @Query("select checkLog from CheckLog checkLog left join fetch checkLog.iDCheckLogGuests where checkLog.id =:id")
    Optional<CheckLog> findOneWithEagerRelationships(@Param("id") Long id);
}

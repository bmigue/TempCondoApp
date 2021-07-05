package com.cenfotec.repository;

import com.cenfotec.domain.UserInterface;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the UserInterface entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserInterfaceRepository extends JpaRepository<UserInterface, Long> {}

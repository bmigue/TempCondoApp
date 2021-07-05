package com.cenfotec.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AdminWallTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AdminWall.class);
        AdminWall adminWall1 = new AdminWall();
        adminWall1.setId(1L);
        AdminWall adminWall2 = new AdminWall();
        adminWall2.setId(adminWall1.getId());
        assertThat(adminWall1).isEqualTo(adminWall2);
        adminWall2.setId(2L);
        assertThat(adminWall1).isNotEqualTo(adminWall2);
        adminWall1.setId(null);
        assertThat(adminWall1).isNotEqualTo(adminWall2);
    }
}

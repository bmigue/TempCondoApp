package com.cenfotec.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GuestTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Guest.class);
        Guest guest1 = new Guest();
        guest1.setId(1L);
        Guest guest2 = new Guest();
        guest2.setId(guest1.getId());
        assertThat(guest1).isEqualTo(guest2);
        guest2.setId(2L);
        assertThat(guest1).isNotEqualTo(guest2);
        guest1.setId(null);
        assertThat(guest1).isNotEqualTo(guest2);
    }
}

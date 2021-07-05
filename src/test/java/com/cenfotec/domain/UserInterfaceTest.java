package com.cenfotec.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserInterfaceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserInterface.class);
        UserInterface userInterface1 = new UserInterface();
        userInterface1.setId(1L);
        UserInterface userInterface2 = new UserInterface();
        userInterface2.setId(userInterface1.getId());
        assertThat(userInterface1).isEqualTo(userInterface2);
        userInterface2.setId(2L);
        assertThat(userInterface1).isNotEqualTo(userInterface2);
        userInterface1.setId(null);
        assertThat(userInterface1).isNotEqualTo(userInterface2);
    }
}
